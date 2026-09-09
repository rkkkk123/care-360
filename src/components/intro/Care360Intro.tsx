"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { ParticleEngine, PHASE, sampleTextPositions } from "@/lib/intro/particles";
import { IntroAudio } from "@/lib/intro/audio";

// ── Props ──────────────────────────────────────────────────────────
interface Care360IntroProps {
  onComplete?: () => void;
}

// ── Constants ──────────────────────────────────────────────────────
const TOTAL_DURATION = 15;
const PARTICLE_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 1200 : 2500;
const FONT = "'Geist', 'Inter', system-ui, -apple-system, sans-serif";

// ── Network layout (normalised -1..1, scaled at runtime) ──────────
const NETWORK_LABELS = ["PATIENT", "AI", "DOCTOR", "PRESCRIPTION", "PHARMACY", "HEALTH"];
const NETWORK_POSITIONS_NORM = [
  { x: -0.55, y: -0.40 },  // PATIENT
  { x: 0, y: -0.10 },      // AI (center)
  { x: 0.55, y: -0.40 },   // DOCTOR
  { x: -0.65, y: 0.35 },   // PRESCRIPTION
  { x: 0.65, y: 0.35 },    // PHARMACY
  { x: 0, y: 0.55 },       // HEALTH
];
const NETWORK_EDGES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [1, 4], [1, 5], [0, 3], [2, 4], [3, 5], [4, 5], [0, 5], [2, 5],
];

// ── Component ──────────────────────────────────────────────────────
export default function Care360Intro({ onComplete }: Care360IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const voiceoverRef = useRef<HTMLAudioElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);
  const audioRef = useRef<IntroAudio | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const completedRef = useRef(false);

  // ── Reduced motion check ───────────────────────────────────────
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Skip handler ───────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    localStorage.setItem("care360_intro_seen", "1");
    onComplete?.();
  }, [onComplete]);

  const skipIntro = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.progress(1);
    }
    audioRef.current?.destroy();
    handleComplete();
  }, [handleComplete]);

  // ── Enable audio on first interaction ──────────────────────────
  const enableAudio = useCallback(() => {
    if (audioEnabled) return;
    
    // Sync and play the external voiceover
    if (voiceoverRef.current && tlRef.current) {
      voiceoverRef.current.volume = 1.0;
      voiceoverRef.current.currentTime = tlRef.current.time();
      voiceoverRef.current.play().catch(e => console.warn("Voiceover play failed:", e));
    }

    if (!audioRef.current) audioRef.current = new IntroAudio();
    if (!audioRef.current.isReady) audioRef.current.init();
    
    setAudioEnabled(true);
  }, [audioEnabled]);

  // ── Keyboard escape ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipIntro();
      else enableAudio();
    };
    const clickHandler = () => enableAudio();
    window.addEventListener("keydown", handler);
    window.addEventListener("click", clickHandler, { once: true });
    window.addEventListener("touchstart", clickHandler, { once: true });
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("touchstart", clickHandler);
    };
  }, [skipIntro, enableAudio]);

  // ── Check reduced motion ───────────────────────────────────────
  useEffect(() => {
    if (prefersReduced) {
      handleComplete();
    }
  }, [prefersReduced, handleComplete]);

  // ── Show skip button after 2s ──────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // ── Resize handler ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => engineRef.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── GSAP TIMELINE + PARTICLE ENGINE ────────────────────────────
  useGSAP(
    () => {
      if (prefersReduced || !canvasRef.current || !containerRef.current) return;

      // Initialise particle engine
      const engine = new ParticleEngine(canvasRef.current, PARTICLE_COUNT);
      engineRef.current = engine;
      engine.start();

      // Initialise audio (silent until user interacts)
      if (!audioRef.current) audioRef.current = new IntroAudio();

      // Scale factor for network positions
      const vw = canvasRef.current.clientWidth;
      const vh = canvasRef.current.clientHeight;
      const scale = Math.min(vw, vh) * 0.38;

      const networkNodes = NETWORK_POSITIONS_NORM.map((n) => ({
        x: n.x * scale,
        y: n.y * scale,
      }));
      engine.setNetworkLayout(networkNodes, NETWORK_EDGES);

      // Pre-compute logo targets (spaced to match HTML layout)
      const logoFontSize = Math.min(vw * 0.07, 64);
      const careTargets = sampleTextPositions("CARE", logoFontSize, FONT, Math.floor(PARTICLE_COUNT * 0.55));
      const threeTargets = sampleTextPositions("360", logoFontSize, FONT, Math.floor(PARTICLE_COUNT * 0.35));
      const gap = logoFontSize * 0.45;
      // Offset 360 targets to the right of CARE targets
      const careWidth = logoFontSize * 2.8;
      const offsetTargets = threeTargets.map(p => ({ x: p.x + careWidth + gap, y: p.y }));
      const allLogoTargets = [...careTargets.map(p => ({ x: p.x - gap * 0.5, y: p.y })), ...offsetTargets];
      engine.setLogoTargets(allLogoTargets);

      // Reference container for text animation queries
      const container = containerRef.current;

      // ── Build master timeline ────────────────────────────────────
      const tl = gsap.timeline({
        paused: true,
        onComplete: handleComplete,
      });
      tlRef.current = tl;

      // Proxy objects for engine state
      const state = {
        activeCount: 0,
        pulseIntensity: 0,
        waveAmplitude: 0,
        convergenceForce: 0,
        flashOpacity: 0,
        globalOpacity: 1,
        trailAlpha: 1,
        cameraZoom: 1,
        cameraX: 0,
        cameraY: 0,
        networkOpacity: 0,
        logoOpacity: 0,
      };

      const syncEngine = () => {
        engine.activeCount = Math.floor(state.activeCount);
        engine.pulseIntensity = state.pulseIntensity;
        engine.waveAmplitude = state.waveAmplitude;
        engine.convergenceForce = state.convergenceForce;
        engine.flashOpacity = state.flashOpacity;
        engine.globalOpacity = state.globalOpacity;
        engine.trailAlpha = state.trailAlpha;
        engine.cameraZoom = state.cameraZoom;
        engine.cameraX = state.cameraX;
        engine.cameraY = state.cameraY;
        engine.networkOpacity = state.networkOpacity;
        engine.logoOpacity = state.logoOpacity;
      };

      // ════════════════════════════════════════════════════════════
      // 0.00 – 1.50  THE VOID: A single point of light
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.PULSE;
        audioRef.current?.playDrone();
      }, [], 0);

      tl.to(state, {
        activeCount: 80,
        pulseIntensity: 1,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: syncEngine,
      }, 0);

      // Subtle camera drift
      tl.to(state, {
        cameraZoom: 1.02,
        cameraY: -3,
        duration: 3,
        ease: "none",
        onUpdate: syncEngine,
      }, 0);

      // ════════════════════════════════════════════════════════════
      // 1.50 – 3.00  WAVEFORM: Pulse becomes a flowing wave
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.WAVEFORM;
        audioRef.current?.playHeartbeat();
      }, [], 1.5);

      tl.to(state, {
        activeCount: PARTICLE_COUNT * 0.85,
        waveAmplitude: Math.min(vh * 0.12, 80),
        pulseIntensity: 0,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: syncEngine,
      }, 1.5);

      // ════════════════════════════════════════════════════════════
      // 3.00 – 4.50  FRAGMENTED WORDS
      // ════════════════════════════════════════════════════════════
      const words = ["REPORT", "VOICE", "DOCTOR", "MEDICINE", "PRESCRIPTION"];
      const wordDuration = 1.4 / words.length;

      tl.call(() => {
        engine.phase = PHASE.TYPOGRAPHY;
        audioRef.current?.playDigitalTexture();
      }, [], 3.0);

      tl.to(state, {
        activeCount: PARTICLE_COUNT,
        duration: 0.3,
        onUpdate: syncEngine,
      }, 3.0);

      words.forEach((word, idx) => {
        const wordStart = 3.0 + idx * wordDuration;
        // Set typography targets
        tl.call(
          () => {
            const fontSize = Math.min(vw * 0.06, 48);
            engine.setTypographyWord(word, fontSize, FONT);
          },
          [],
          wordStart,
        );

        // Animate the DOM word overlay
        const selector = `.frag-word-${idx}`;
        tl.fromTo(
          container.querySelector(selector),
          { opacity: 0, filter: "blur(12px)", y: 15, scale: 0.95 },
          {
            opacity: 0.95,
            filter: "blur(0px)",
            y: 0,
            scale: 1,
            duration: wordDuration * 0.45,
            ease: "power2.out",
          },
          wordStart,
        );
        tl.to(
          container.querySelector(selector),
          {
            opacity: 0,
            filter: "blur(8px)",
            y: -10,
            duration: wordDuration * 0.45,
            ease: "power2.in",
          },
          wordStart + wordDuration * 0.5,
        );
      });

      // ════════════════════════════════════════════════════════════
      // 4.50 – 6.00  THE STATEMENTS
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.FREEZE;
      }, [], 4.5);

      // "Healthcare became information."
      tl.fromTo(
        container.querySelector(".statement-1"),
        { opacity: 0, filter: "blur(10px)", y: 20, letterSpacing: "0.15em" },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          letterSpacing: "-0.02em",
          duration: 0.5,
          ease: "power3.out",
        },
        4.5,
      );
      tl.to(
        container.querySelector(".statement-1"),
        {
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.3,
          ease: "power2.in",
        },
        5.15,
      );

      // "AI made it understandable."
      tl.fromTo(
        container.querySelector(".statement-2"),
        { opacity: 0, filter: "blur(10px)", y: 20, letterSpacing: "0.15em" },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          letterSpacing: "-0.02em",
          duration: 0.5,
          ease: "power3.out",
        },
        5.5,
      );
      tl.to(
        container.querySelector(".statement-2"),
        {
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.25,
          ease: "power2.in",
        },
        6.0,
      );

      // ════════════════════════════════════════════════════════════
      // 6.00 – 8.50  INTELLIGENCE NETWORK
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.NETWORK;
        audioRef.current?.playRiser();
      }, [], 6.0);

      tl.to(state, {
        networkOpacity: 1,
        cameraZoom: 1.08,
        cameraY: -8,
        duration: 2.5,
        ease: "power1.inOut",
        onUpdate: syncEngine,
      }, 6.0);

      // ════════════════════════════════════════════════════════════
      // 8.50 – 10.50  NETWORK NODES + STATEMENT
      // ════════════════════════════════════════════════════════════
      // Stagger node labels
      NETWORK_LABELS.forEach((label, idx) => {
        const nodeStart = 8.5 + idx * 0.2;
        const selector = `.node-label-${idx}`;
        const node = networkNodes[idx];

        tl.call(() => {
          const el = container.querySelector(selector) as HTMLElement;
          if (el) {
            const cx = vw / 2 + node.x * state.cameraZoom + state.cameraX;
            const cy = vh / 2 + node.y * state.cameraZoom + state.cameraY;
            // Position labels outside the tight particle clusters
            const isTop = node.y < 0;
            const yOffset = isTop ? -55 : 45;
            el.style.left = `${cx}px`;
            el.style.top = `${cy + yOffset}px`;
          }
        }, [], nodeStart);

        tl.fromTo(
          container.querySelector(selector),
          { opacity: 0, filter: "blur(6px)", scale: 0.8 },
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          nodeStart,
        );
      });

      // "Understanding becomes care."
      tl.fromTo(
        container.querySelector(".statement-3"),
        { opacity: 0, filter: "blur(10px)", y: 20, letterSpacing: "0.15em" },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          letterSpacing: "-0.02em",
          duration: 0.5,
          ease: "power3.out",
        },
        9.8,
      );
      tl.to(
        container.querySelector(".statement-3"),
        { opacity: 0, filter: "blur(6px)", duration: 0.25, ease: "power2.in" },
        10.3,
      );

      // Fade out node labels
      tl.to(
        container.querySelectorAll('[class*="node-label-"]'),
        { opacity: 0, filter: "blur(4px)", duration: 0.3, stagger: 0.03 },
        10.2,
      );

      // ════════════════════════════════════════════════════════════
      // 10.50 – 11.80  CONVERGENCE
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.CONVERGE;
        audioRef.current?.playTension();
      }, [], 10.5);

      tl.to(state, {
        convergenceForce: 0.08,
        networkOpacity: 0,
        trailAlpha: 0.3,
        cameraZoom: 1.3,
        duration: 1.1,
        ease: "power3.in",
        onUpdate: syncEngine,
      }, 10.5);

      // Flash
      tl.to(state, {
        flashOpacity: 0.8,
        duration: 0.15,
        ease: "power4.in",
        onUpdate: syncEngine,
      }, 11.5);

      tl.to(state, {
        flashOpacity: 0,
        convergenceForce: 0,
        trailAlpha: 1,
        cameraZoom: 1,
        cameraX: 0,
        cameraY: 0,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: syncEngine,
      }, 11.65);

      // ════════════════════════════════════════════════════════════
      // 11.80 – 13.50  LOGO REVEAL
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.LOGO;
        audioRef.current?.playImpact();
      }, [], 11.8);

      tl.to(state, {
        activeCount: PARTICLE_COUNT,
        logoOpacity: 1,
        duration: 1.7,
        ease: "power2.out",
        onUpdate: syncEngine,
      }, 11.8);

      // SVG logo fade in over particles
      tl.fromTo(
        container.querySelector(".logo-svg"),
        { opacity: 0, scale: 0.92, filter: "blur(4px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
        },
        12.3,
      );

      // Leaf color animation
      tl.fromTo(
        container.querySelector(".logo-leaf"),
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        13.0,
      );

      // ════════════════════════════════════════════════════════════
      // 13.50 – 15.00  FINAL REVEAL
      // ════════════════════════════════════════════════════════════
      tl.call(() => {
        engine.phase = PHASE.FINAL;
        audioRef.current?.playResolution();
      }, [], 13.5);

      // Background transition
      tl.to(
        container,
        {
          backgroundColor: "#060D18",
          duration: 1.2,
          ease: "power2.inOut",
        },
        13.5,
      );

      // Tagline
      tl.fromTo(
        container.querySelector(".tagline-main"),
        { opacity: 0, y: 20, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
        },
        13.8,
      );

      // Particle fade on final
      tl.to(state, {
        globalOpacity: 0.15,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: syncEngine,
      }, 13.5);

      // ── Play! ────────────────────────────────────────────────────
      tl.play();

      return () => {
        tl.kill();
        engine.destroy();
        audioRef.current?.destroy();
      };
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  // ── Reduced motion fallback ────────────────────────────────────
  if (prefersReduced) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="bg-transition fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      {/* ── Audio ──────────────────────────────────────────────── */}
      <audio ref={voiceoverRef} src="/audio/voiceover.mp3" preload="auto" />

      {/* ── Canvas (z-0) ───────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ display: "block" }}
      />

      {/* ── Fragmented words (z-10) ────────────────────────────── */}
      {["REPORT", "VOICE", "DOCTOR", "MEDICINE", "PRESCRIPTION"].map(
        (word, i) => (
          <div
            key={word}
            className={`frag-word-${i} absolute inset-0 flex items-center justify-center pointer-events-none z-10`}
            style={{ opacity: 0 }}
          >
            <span
              className="text-white tracking-[0.3em] font-extralight"
              style={{
                fontSize: "clamp(22px, 4vw, 42px)",
                fontFamily: FONT,
                textShadow: "0 0 30px rgba(245,245,247,0.3)",
              }}
            >
              {word}
            </span>
          </div>
        ),
      )}

      {/* ── Statements (z-10) ──────────────────────────────────── */}
      <div
        className="statement-1 absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <p
          className="text-white text-center font-extralight px-8"
          style={{
            fontSize: "clamp(24px, 4.5vw, 48px)",
            fontFamily: FONT,
            letterSpacing: "0.15em",
            textShadow: "0 0 40px rgba(245,245,247,0.2)",
          }}
        >
          Healthcare became information.
        </p>
      </div>

      <div
        className="statement-2 absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <p
          className="text-white text-center font-extralight px-8"
          style={{
            fontSize: "clamp(24px, 4.5vw, 48px)",
            fontFamily: FONT,
            letterSpacing: "0.15em",
            textShadow: "0 0 40px rgba(245,245,247,0.2)",
          }}
        >
          AI made it understandable.
        </p>
      </div>

      <div
        className="statement-3 absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <p
          className="text-white text-center font-extralight px-8"
          style={{
            fontSize: "clamp(24px, 4.5vw, 48px)",
            fontFamily: FONT,
            letterSpacing: "0.15em",
            textShadow: "0 0 40px rgba(245,245,247,0.2)",
          }}
        >
          Understanding becomes care.
        </p>
      </div>

      {/* ── Network node labels (z-10) ─────────────────────────── */}
      {NETWORK_LABELS.map((label, i) => (
        <div
          key={label}
          className={`node-label-${i} absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10`}
          style={{ opacity: 0 }}
        >
          <span
            className="text-white tracking-[0.25em] font-light"
            style={{
              fontSize: "clamp(11px, 1.5vw, 16px)",
              fontFamily: FONT,
              textShadow: "0 0 20px rgba(245,245,247,0.3)",
            }}
          >
            {label}
          </span>
        </div>
      ))}

      {/* ── Logo + Taglines (z-20, single container) ────────────── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
      >
        {/* Logo */}
        <div className="logo-svg relative" style={{ opacity: 0 }}>
          <div
            className="flex items-center"
            style={{ gap: "clamp(14px, 2.5vw, 28px)" }}
          >
            <span
              style={{
                fontSize: "clamp(40px, 7vw, 76px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#F97316",
                fontFamily: FONT,
                lineHeight: 1,
              }}
            >
              CARE
            </span>
            <span
              style={{
                fontSize: "clamp(40px, 7vw, 76px)",
                fontWeight: 300,
                letterSpacing: "-0.01em",
                color: "#34C759",
                fontFamily: FONT,
                lineHeight: 1,
              }}
            >
              360
            </span>
          </div>

          {/* Realistic Leaf */}
          <div
            className="logo-leaf absolute"
            style={{
              opacity: 0,
              top: "-2px",
              right: "clamp(-32px, -4vw, -44px)",
              transformOrigin: "center center",
            }}
          >
            <svg
              viewBox="0 0 44 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "clamp(22px, 3.5vw, 38px)", height: "auto" }}
            >
              <defs>
                <linearGradient id="leafGrad" x1="0.25" y1="0" x2="0.75" y2="1">
                  <stop offset="0%" stopColor="#6EE7A0" />
                  <stop offset="40%" stopColor="#34C759" />
                  <stop offset="100%" stopColor="#1B8A3E" />
                </linearGradient>
                <linearGradient id="leafGradDark" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#2AAF5A" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#1B7A35" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Main leaf body */}
              <path
                d="M22,2 C30,3 39,13 38,24 C37,35 30,46 22,50 C14,46 7,35 6,24 C5,13 14,3 22,2Z"
                fill="url(#leafGrad)"
              />
              {/* Inner shadow for depth */}
              <path
                d="M22,6 C28,8 34,16 33,25 C32,34 28,42 22,46 C18,42 14,36 14,28 C14,18 18,10 22,6Z"
                fill="url(#leafGradDark)"
                opacity="0.3"
              />
              {/* Central midrib */}
              <path
                d="M22,48 Q22,30 22,8 L22,4"
                stroke="rgba(22,90,50,0.5)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right veins */}
              <path d="M22,40 Q30,34 35,30" stroke="rgba(22,90,50,0.3)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
              <path d="M22,32 Q29,27 34,22" stroke="rgba(22,90,50,0.25)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              <path d="M22,24 Q28,20 32,16" stroke="rgba(22,90,50,0.2)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              <path d="M22,16 Q26,13 30,10" stroke="rgba(22,90,50,0.15)" strokeWidth="0.4" fill="none" strokeLinecap="round" />
              {/* Left veins */}
              <path d="M22,40 Q14,34 9,30" stroke="rgba(22,90,50,0.3)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
              <path d="M22,32 Q15,27 10,22" stroke="rgba(22,90,50,0.25)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              <path d="M22,24 Q16,20 12,16" stroke="rgba(22,90,50,0.2)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              <path d="M22,16 Q18,13 14,10" stroke="rgba(22,90,50,0.15)" strokeWidth="0.4" fill="none" strokeLinecap="round" />
              {/* Stem */}
              <path
                d="M22,50 Q21,53 19,55"
                stroke="#2A9D4E"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Tagline — below logo */}
        <div className="tagline-main mt-8" style={{ opacity: 0 }}>
          <p
            className="text-white/80 text-center font-light tracking-wide max-w-2xl px-6"
            style={{
              fontSize: "clamp(16px, 1.8vw, 24px)",
              fontFamily: FONT,
              lineHeight: "1.5",
            }}
          >
            AI is shaping mankind&apos;s health through its extraordinary capabilities.
          </p>
        </div>
      </div>

      {/* ── Skip button ────────────────────────────────────────── */}
      {showSkip && (
        <button
          onClick={skipIntro}
          className="fixed bottom-8 right-8 z-50 text-white/30 hover:text-white/70 transition-colors duration-500 font-light tracking-widest uppercase"
          style={{
            fontSize: "11px",
            fontFamily: FONT,
            animation: "fadeIn 1s ease-out",
          }}
          aria-label="Skip intro animation"
        >
          Skip <span className="text-white/15 ml-1">ESC</span>
        </button>
      )}

      {/* ── Audio enable hint ──────────────────────────────────── */}
      {!audioEnabled && showSkip && (
        <button
          onClick={enableAudio}
          className="fixed bottom-8 left-8 z-50 text-white/20 hover:text-white/50 transition-colors duration-500 font-light tracking-widest uppercase"
          style={{
            fontSize: "10px",
            fontFamily: FONT,
            animation: "fadeIn 1.5s ease-out",
          }}
          aria-label="Enable sound"
        >
          🔇 Click for sound
        </button>
      )}
    </div>
  );
}
