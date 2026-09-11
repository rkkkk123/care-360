/**
 * CARE360 Cinematic Particle Engine
 *
 * High-performance Canvas 2D particle system using typed-array SoA layout.
 * Zero allocations in the hot loop. Phase-driven behavior controlled by
 * the GSAP master timeline.
 */

// ── Phase constants ────────────────────────────────────────────────
export const PHASE = {
  IDLE: 0,
  DNA: 1,
  PULSE: 1, // backward compatibility
  WAVEFORM: 2,
  DISPERSE: 3,
  TYPOGRAPHY: 4,
  FREEZE: 5,
  NETWORK: 6,
  CONVERGE: 7,
  LOGO: 8,
  FINAL: 9,
} as const;

export type ParticlePhase = (typeof PHASE)[keyof typeof PHASE];

// ── Helpers ────────────────────────────────────────────────────────
const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Sample white pixels from text rendered on an offscreen canvas.
 * Returns normalised positions centred on (0, 0).
 */
export function sampleTextPositions(
  text: string,
  fontSize: number,
  fontFamily: string,
  maxPositions: number,
): { x: number; y: number }[] {
  const canvas = document.createElement("canvas");
  const padding = fontSize * 0.3;
  canvas.width = fontSize * text.length * 0.7 + padding * 2;
  canvas.height = fontSize * 1.4 + padding * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `700 ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const raw: { x: number; y: number }[] = [];
  const step = Math.max(
    2,
    Math.floor(
      Math.sqrt((canvas.width * canvas.height) / (maxPositions * 1.5)),
    ),
  );

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (img.data[(y * canvas.width + x) * 4 + 3] > 100) {
        raw.push({
          x: x - canvas.width / 2,
          y: y - canvas.height / 2,
        });
      }
    }
  }

  // Subsample if too many
  if (raw.length > maxPositions) {
    const ratio = maxPositions / raw.length;
    return raw.filter(() => Math.random() < ratio);
  }
  return raw;
}

// ── Engine ─────────────────────────────────────────────────────────
export class ParticleEngine {
  // SoA buffers
  private x: Float32Array;
  private y: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;
  private opacity: Float32Array;
  private baseSize: Float32Array;
  private z: Float32Array;
  private seed: Float32Array; // per-particle random seed for variety

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private count: number;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId = 0;
  private time = 0;
  private running = false;

  // ── Timeline-driven state ──────────────────────────────────────
  phase: ParticlePhase = PHASE.IDLE;
  activeCount = 0;
  pulseIntensity = 0;
  waveAmplitude = 0;
  convergenceForce = 0;
  flashOpacity = 0;
  globalOpacity = 1;
  trailAlpha = 1; // 1 = full clear, lower = trails
  cameraZoom = 1;
  cameraX = 0;
  cameraY = 0;

  // Typography
  private typoTargets: { x: number; y: number }[] = [];
  // Network
  private networkNodes: { x: number; y: number }[] = [];
  private networkEdges: [number, number][] = [];
  networkOpacity = 0;
  // Logo
  private logoTargets: { x: number; y: number }[] = [];
  logoOpacity = 0;

  // ── Tuning ─────────────────────────────────────────────────────
  private readonly SPRING = 0.035;
  private readonly DAMPING = 0.88;
  private readonly FRICTION = 0.96;

  constructor(canvas: HTMLCanvasElement, count = 2500) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.count = count;

    this.x = new Float32Array(count);
    this.y = new Float32Array(count);
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.tx = new Float32Array(count);
    this.ty = new Float32Array(count);
    this.opacity = new Float32Array(count);
    this.baseSize = new Float32Array(count);
    this.z = new Float32Array(count);
    this.seed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.baseSize[i] = 0.6 + Math.random() * 1.8;
      this.z[i] = 0.2 + Math.random() * 0.8;
      this.seed[i] = Math.random() * TAU;
    }

    this.resize();
  }

  // ── Public API ─────────────────────────────────────────────────

  resize() {
    this.dpr = Math.min(window.devicePixelRatio, 2);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.tick();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  setTypographyWord(word: string, fontSize: number, fontFamily: string) {
    this.typoTargets = sampleTextPositions(
      word,
      fontSize,
      fontFamily,
      this.count,
    );
  }

  setNetworkLayout(
    nodes: { x: number; y: number }[],
    edges: [number, number][],
  ) {
    this.networkNodes = nodes;
    this.networkEdges = edges;
  }

  setLogoTargets(targets: { x: number; y: number }[]) {
    this.logoTargets = targets;
  }

  destroy() {
    this.stop();
  }

  // ── Private ────────────────────────────────────────────────────
  private lastFrame = 0;

  private tick = () => {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastFrame) / 16.667, 2); // normalise to 60fps
    this.lastFrame = now;
    this.time += dt * 0.016;

    this.update(dt);
    this.render();

    this.rafId = requestAnimationFrame(this.tick);
  };

  private update(dt: number) {
    const ac = Math.min(this.activeCount, this.count);
    const w = this.width;
    const h = this.height;
    const phase = this.phase;
    const time = this.time;

    for (let i = 0; i < ac; i++) {
      const s = this.seed[i];

      switch (phase) {
        case PHASE.DNA: {
          const h = Math.min(this.height * 0.75, 580);
          const r = Math.min(this.width, this.height) * 0.17;
          const rot = time * 1.6;
          const turns = 2.4;
          const tilt = -0.18;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const strandCount = Math.floor(ac * 0.35);
          const rungCount = Math.floor(ac * 0.2);
          const numRungs = 26;
          const fov = 650;

          if (i < strandCount) {
            // Strand A (Emerald Helix)
            const t = i / Math.max(1, strandCount);
            const y0 = (t - 0.5) * h;
            const theta = t * turns * TAU + rot;
            const x0 = Math.cos(theta) * r;
            const z0 = Math.sin(theta) * r;

            const x3d = x0 * cosT - y0 * sinT;
            const y3d = x0 * sinT + y0 * cosT;
            const z3d = z0;

            const scale = fov / (fov - z3d);
            this.tx[i] = x3d * scale;
            this.ty[i] = y3d * scale;
            const depth = (z3d + r) / (2 * r);
            this.z[i] = Math.max(0, Math.min(1, depth));
            this.opacity[i] = lerp(this.opacity[i], 0.35 + this.z[i] * 0.65, 0.08 * dt);
          } else if (i < strandCount * 2) {
            // Strand B (Orange Helix - opposing 180° twist)
            const idx = i - strandCount;
            const t = idx / Math.max(1, strandCount);
            const y0 = (t - 0.5) * h;
            const theta = t * turns * TAU + rot + Math.PI;
            const x0 = Math.cos(theta) * r;
            const z0 = Math.sin(theta) * r;

            const x3d = x0 * cosT - y0 * sinT;
            const y3d = x0 * sinT + y0 * cosT;
            const z3d = z0;

            const scale = fov / (fov - z3d);
            this.tx[i] = x3d * scale;
            this.ty[i] = y3d * scale;
            const depth = (z3d + r) / (2 * r);
            this.z[i] = Math.max(0, Math.min(1, depth));
            this.opacity[i] = lerp(this.opacity[i], 0.35 + this.z[i] * 0.65, 0.08 * dt);
          } else if (i < strandCount * 2 + rungCount) {
            // Base-pair ladder rungs across strands
            const idx = i - strandCount * 2;
            const rungIdx = idx % numRungs;
            const rungT = (rungIdx + 0.5) / numRungs;
            const u = ((Math.floor(idx / numRungs)) % 12) / 11;
            const y0 = (rungT - 0.5) * h;
            const theta = rungT * turns * TAU + rot;

            const xA = Math.cos(theta) * r;
            const zA = Math.sin(theta) * r;
            const xB = Math.cos(theta + Math.PI) * r;
            const zB = Math.sin(theta + Math.PI) * r;

            const x0 = lerp(xA, xB, u);
            const z0 = lerp(zA, zB, u);

            const x3d = x0 * cosT - y0 * sinT;
            const y3d = x0 * sinT + y0 * cosT;
            const z3d = z0;

            const scale = fov / (fov - z3d);
            this.tx[i] = x3d * scale;
            this.ty[i] = y3d * scale;
            const depth = (z3d + r) / (2 * r);
            this.z[i] = Math.max(0, Math.min(1, depth));
            this.opacity[i] = lerp(this.opacity[i], 0.25 + this.z[i] * 0.55, 0.08 * dt);
          } else {
            // Ambient bio-luminescent cellular ions
            const auraIdx = i - (strandCount * 2 + rungCount);
            const totalAura = Math.max(1, ac - (strandCount * 2 + rungCount));
            const t = auraIdx / totalAura;
            const y0 = (t - 0.5) * h * 1.15 + Math.sin(s + time) * 15;
            const orbitR = r * (1.2 + 0.6 * Math.sin(s * 2 + time * 0.8));
            const angle = s + rot * 0.6;

            const x0 = Math.cos(angle) * orbitR;
            const z0 = Math.sin(angle) * orbitR;

            const x3d = x0 * cosT - y0 * sinT;
            const y3d = x0 * sinT + y0 * cosT;
            const z3d = z0;

            const scale = fov / (fov - z3d);
            this.tx[i] = x3d * scale;
            this.ty[i] = y3d * scale;
            const depth = (z3d + orbitR) / (2 * orbitR);
            this.z[i] = Math.max(0, Math.min(1, depth));
            this.opacity[i] = lerp(this.opacity[i], 0.12 + 0.2 * Math.sin(s + time * 3), 0.06 * dt);
          }
          break;
        }

        case PHASE.WAVEFORM: {
          const t = i / ac;
          this.tx[i] = (t - 0.5) * w * 0.65;
          this.ty[i] =
            Math.sin(t * Math.PI * 5 + time * 3 + s * 0.3) *
            this.waveAmplitude *
            (0.5 + this.z[i] * 0.5);
          this.opacity[i] = lerp(this.opacity[i], 0.4 + this.z[i] * 0.5, 0.06 * dt);
          break;
        }

        case PHASE.DISPERSE: {
          this.vx[i] += (Math.cos(s + time) * 0.15 - this.x[i] * 0.0003) * dt;
          this.vy[i] += (Math.sin(s + time) * 0.15 - this.y[i] * 0.0003) * dt;
          this.vx[i] *= this.FRICTION;
          this.vy[i] *= this.FRICTION;
          this.x[i] += this.vx[i] * dt;
          this.y[i] += this.vy[i] * dt;
          this.opacity[i] = lerp(this.opacity[i], 0.15 + this.z[i] * 0.25, 0.04 * dt);
          continue; // skip spring interp
        }

        case PHASE.TYPOGRAPHY: {
          if (i < this.typoTargets.length) {
            this.tx[i] = this.typoTargets[i].x;
            this.ty[i] = this.typoTargets[i].y;
            this.opacity[i] = lerp(this.opacity[i], 0.7 + this.z[i] * 0.3, 0.08 * dt);
          } else {
            this.tx[i] =
              Math.cos(s + time) * w * 0.35 * (0.3 + this.z[i] * 0.7);
            this.ty[i] =
              Math.sin(s * 1.3 + time * 0.7) *
              h *
              0.3 *
              (0.3 + this.z[i] * 0.7);
            this.opacity[i] = lerp(this.opacity[i], 0.06, 0.05 * dt);
          }
          break;
        }

        case PHASE.FREEZE: {
          this.vx[i] *= 0.92;
          this.vy[i] *= 0.92;
          this.x[i] += this.vx[i] * dt;
          this.y[i] += this.vy[i] * dt;
          this.opacity[i] = lerp(this.opacity[i], 0.04, 0.04 * dt);
          continue;
        }

        case PHASE.NETWORK: {
          // Assign particle to nearest node
          if (this.networkNodes.length > 0) {
            const nodeIdx = i % this.networkNodes.length;
            const node = this.networkNodes[nodeIdx];
            const orbitR = 8 + (i % 25) * 1.2;
            this.tx[i] =
              node.x + Math.cos(s + time * 0.8 + i * 0.01) * orbitR;
            this.ty[i] =
              node.y + Math.sin(s + time * 0.8 + i * 0.01) * orbitR;
            this.opacity[i] = lerp(
              this.opacity[i],
              0.25 + this.z[i] * 0.45,
              0.04 * dt,
            );
          }
          break;
        }

        case PHASE.CONVERGE: {
          const cf = this.convergenceForce;
          this.vx[i] += -this.x[i] * cf * dt;
          this.vy[i] += -this.y[i] * cf * dt;
          this.vx[i] *= 0.97;
          this.vy[i] *= 0.97;
          this.x[i] += this.vx[i] * dt;
          this.y[i] += this.vy[i] * dt;
          this.opacity[i] = lerp(
            this.opacity[i],
            Math.min(1, cf * 15),
            0.08 * dt,
          );
          continue;
        }

        case PHASE.LOGO: {
          if (i < this.logoTargets.length) {
            this.tx[i] = this.logoTargets[i].x;
            this.ty[i] = this.logoTargets[i].y;
            this.opacity[i] = lerp(
              this.opacity[i],
              0.85 + this.z[i] * 0.15,
              0.06 * dt,
            );
          } else {
            this.tx[i] = Math.cos(s) * w * 0.4;
            this.ty[i] = Math.sin(s) * h * 0.4;
            this.opacity[i] = lerp(this.opacity[i], 0.02, 0.06 * dt);
          }
          break;
        }

        case PHASE.FINAL: {
          if (i < this.logoTargets.length) {
            this.tx[i] = this.logoTargets[i].x;
            this.ty[i] = this.logoTargets[i].y;
            this.opacity[i] = lerp(this.opacity[i], 1, 0.05 * dt);
          } else {
            this.opacity[i] = lerp(this.opacity[i], 0, 0.05 * dt);
          }
          break;
        }

        default:
          this.opacity[i] = 0;
          continue;
      }

      // Spring interpolation toward targets
      const dx = this.tx[i] - this.x[i];
      const dy = this.ty[i] - this.y[i];
      this.vx[i] = (this.vx[i] + dx * this.SPRING * dt) * this.DAMPING;
      this.vy[i] = (this.vy[i] + dy * this.SPRING * dt) * this.DAMPING;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
    }

    // Fade out inactive particles
    for (let i = ac; i < this.count; i++) {
      this.opacity[i] = lerp(this.opacity[i], 0, 0.1 * dt);
    }
  }

  private render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const dpr = this.dpr;
    const ac = Math.min(this.activeCount, this.count);

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear with trail or full clear
    if (this.trailAlpha >= 0.99) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = `rgba(0,0,0,${this.trailAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Camera transform
    ctx.translate(w / 2 + this.cameraX, h / 2 + this.cameraY);
    ctx.scale(this.cameraZoom, this.cameraZoom);

    // ── Draw network connections ─────────────────────────────────
    if (
      this.phase === PHASE.NETWORK &&
      this.networkOpacity > 0.01 &&
      this.networkNodes.length > 0
    ) {
      ctx.strokeStyle = `rgba(245,245,247,${this.networkOpacity * 0.12})`;
      ctx.lineWidth = 0.5;
      for (const [a, b] of this.networkEdges) {
        const na = this.networkNodes[a];
        const nb = this.networkNodes[b];
        if (na && nb) {
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      // Node glows
      for (const node of this.networkNodes) {
        const grad = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          30,
        );
        grad.addColorStop(
          0,
          `rgba(52,199,89,${this.networkOpacity * 0.15})`,
        );
        grad.addColorStop(1, "rgba(52,199,89,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, TAU);
        ctx.fill();
      }
    }

    // ── Draw DNA base-pair rungs ───────────────────────────────
    if (this.phase === PHASE.DNA && this.activeCount > 80) {
      const h = Math.min(this.height * 0.75, 580);
      const r = Math.min(this.width, this.height) * 0.17;
      const rot = this.time * 1.6;
      const turns = 2.4;
      const tilt = -0.18;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const numRungs = 26;
      const fov = 650;

      for (let rIdx = 0; rIdx < numRungs; rIdx++) {
        const rungT = (rIdx + 0.5) / numRungs;
        const y0 = (rungT - 0.5) * h;
        const theta = rungT * turns * TAU + rot;

        const x0A = Math.cos(theta) * r;
        const z0A = Math.sin(theta) * r;
        const x0B = Math.cos(theta + Math.PI) * r;
        const z0B = Math.sin(theta + Math.PI) * r;

        const x3dA = x0A * cosT - y0 * sinT;
        const y3dA = x0A * sinT + y0 * cosT;
        const x3dB = x0B * cosT - y0 * sinT;
        const y3dB = x0B * sinT + y0 * cosT;

        const scaleA = fov / (fov - z0A);
        const scaleB = fov / (fov - z0B);

        const ax = x3dA * scaleA;
        const ay = y3dA * scaleA;
        const bx = x3dB * scaleB;
        const by = y3dB * scaleB;

        const avgZ = (z0A + z0B) * 0.5;
        const depthNorm = Math.max(0, Math.min(1, (avgZ + r) / (2 * r)));
        const rungAlpha = (0.05 + depthNorm * 0.2) * this.globalOpacity;

        if (rungAlpha > 0.01) {
          const grad = ctx.createLinearGradient(ax, ay, bx, by);
          grad.addColorStop(0, `rgba(52,199,89,${rungAlpha * 0.9})`);
          grad.addColorStop(0.5, `rgba(224,242,254,${rungAlpha * 1.3})`);
          grad.addColorStop(1, `rgba(249,115,22,${rungAlpha * 0.9})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(0.6, 1.2 * scaleA);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
    }

    // ── Draw particles ───────────────────────────────────────────
    const go = this.globalOpacity;
    const isDNA = this.phase === PHASE.DNA;
    const isLogo = this.phase === PHASE.LOGO || this.phase === PHASE.FINAL;
    const strandCount = Math.floor(this.count * 0.35);
    const rungCount = Math.floor(this.count * 0.2);
    const careTargetCount = Math.floor(this.count * 0.55);

    for (let i = 0; i < this.count; i++) {
      const a = this.opacity[i] * go;
      if (a < 0.005) continue;

      const sz = this.baseSize[i] * (0.4 + this.z[i] * 0.6);
      const px = this.x[i];
      const py = this.y[i];

      let color = "#F5F5F7";
      if (isDNA) {
        if (i < strandCount) {
          color = "#6EE7A0"; // Emerald Strand A
        } else if (i < strandCount * 2) {
          color = "#FDBA74"; // Orange Strand B
        } else if (i < strandCount * 2 + rungCount) {
          color = "#E0F2FE"; // Cyan Rungs
        }
      } else if (isLogo) {
        if (i < careTargetCount) {
          color = "#FB923C"; // CARE Orange
        } else if (i < this.logoTargets.length) {
          color = "#4ADE80"; // 360 Green
        }
      }

      // Glow layer
      if (a > 0.08 && sz > 0.8) {
        ctx.globalAlpha = a * 0.16;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, sz * 3.5, 0, TAU);
        ctx.fill();
      }

      // Core particle
      ctx.globalAlpha = a;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, TAU);
      ctx.fill();
    }

    // ── Central glow (pulse phase) ───────────────────────────────
    if (this.pulseIntensity > 0.01) {
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 60 * this.pulseIntensity);
      gr.addColorStop(0, `rgba(245,245,247,${this.pulseIntensity * 0.3})`);
      gr.addColorStop(0.5, `rgba(245,245,247,${this.pulseIntensity * 0.05})`);
      gr.addColorStop(1, "rgba(245,245,247,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(0, 0, 60 * this.pulseIntensity, 0, TAU);
      ctx.fill();
    }

    // ── Flash overlay ────────────────────────────────────────────
    if (this.flashOpacity > 0.005) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = this.flashOpacity;
      ctx.fillStyle = "#F5F5F7";
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }
}
