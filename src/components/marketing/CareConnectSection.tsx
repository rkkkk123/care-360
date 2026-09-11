"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  ExternalLink,
  Clock,
  Newspaper,
  CheckCircle2,
  RefreshCw,
  Search,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
  Radio,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicalNewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl: string;
  category: string;
  aiSummary: string;
  keyTakeaways?: string[];
  aiModel?: string;
  readTime?: string;
}

// Guaranteed verified medical imagery
const RELIABLE_FALLBACK_IMAGES: Record<string, string> = {
  "Biotech & Genomics": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
  "Cardiology & Metabolism": "https://images.unsplash.com/photo-1583912267550-d44d9c9b1395?auto=format&fit=crop&w=800&q=80",
  "Medical AI & Tech": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  "Preventive Health": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
  "Clinical Breakthroughs": "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
  default: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
};

/**
 * Robust, Zero-Breakdown Medical Image Component
 * Prevents broken images, provides smooth skeleton shimmer, and gracefully degrades.
 */
function SafeMedicalImage({
  src,
  alt,
  category,
}: {
  src: string;
  alt: string;
  category: string;
}) {
  const fallbackUrl = RELIABLE_FALLBACK_IMAGES[category] || RELIABLE_FALLBACK_IMAGES.default;
  const [imgSrc, setImgSrc] = React.useState<string>(src || fallbackUrl);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const fallbackAttempted = React.useRef<boolean>(false);

  // When parent prop changes, update internal source
  React.useEffect(() => {
    setImgSrc(src || fallbackUrl);
    setHasError(false);
    setIsLoaded(false);
    fallbackAttempted.current = false;
  }, [src, fallbackUrl]);

  const handleError = () => {
    if (!fallbackAttempted.current) {
      fallbackAttempted.current = true;
      setImgSrc(fallbackUrl);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // Ultimate graceful SVG fallback if offline or blocked
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center p-4 text-center text-white">
        <Stethoscope className="h-8 w-8 text-blue-400 mb-2 opacity-80" />
        <span className="text-[11px] font-medium tracking-wide uppercase text-blue-200">
          {category}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100">
      {/* Skeleton Shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center">
          <Activity className="h-5 w-5 text-slate-400/50 animate-spin" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export function CareConnectSection() {
  const [articles, setArticles] = React.useState<MedicalNewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  // Auto-refresh configuration (in seconds: 0 = off, 30 = 30s, 60 = 1 min, 120 = 2 min)
  const [autoRefreshInterval, setAutoRefreshInterval] = React.useState<number>(60);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = React.useState<number>(60);

  const fetchNews = async (category = "all", forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const url = `/api/news?category=${category}${forceRefresh ? `&refresh=true&t=${Date.now()}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.articles)) {
          setArticles(data.articles);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error("Failed to load medical news:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Reset countdown
      if (autoRefreshInterval > 0) {
        setSecondsUntilRefresh(autoRefreshInterval);
      }
    }
  };

  // Initial load & category change
  React.useEffect(() => {
    fetchNews(activeCategory, false);
  }, [activeCategory]);

  // Live Auto-Refresh Ticker (Every second)
  React.useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          // Trigger automatic background refresh
          fetchNews(activeCategory, true);
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, activeCategory]);

  // Client-side search filter
  const filteredArticles = articles.filter((art) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.aiSummary?.toLowerCase().includes(q) ||
      art.source.toLowerCase().includes(q) ||
      art.category?.toLowerCase().includes(q)
    );
  });

  const categories = [
    { id: "all", label: "All Medical Science" },
    { id: "clinical", label: "Clinical Breakthroughs" },
    { id: "biotech", label: "Biotech & Genomics" },
    { id: "cardiology", label: "Cardiology & Metabolism" },
    { id: "ai", label: "Medical AI & Tech" },
    { id: "preventive", label: "Preventive Health" },
  ];

  return (
    <section
      id="care"
      className="w-full bg-white text-slate-900 border-y border-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-20"
    >
      {/* Subtle crisp background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs">
              <Radio className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>CARE360 CareConnect Wire</span>
              <span className="h-1 w-1 rounded-full bg-blue-400" />
              <span className="text-[11px] font-normal text-blue-600">
                Live Global Medical Intelligence
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950">
              Health & Medical{" "}
              <span className="font-semibold text-blue-600">Science Breakthroughs</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Curated peer-reviewed discoveries, clinical trials, and pharmacology breakthroughs from premier global journals—summarized at lightning speed with <strong>Llama 3 & Medical AI</strong>.
            </p>
          </div>

          {/* Live Feed Status & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50/80 p-2 sm:p-2.5 rounded-2xl border border-slate-200">
            {/* Countdown / Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>
                {autoRefreshInterval > 0
                  ? `Live: Refreshes in ${secondsUntilRefresh}s`
                  : "Auto-refresh Paused"}
              </span>
            </div>

            {/* Auto Refresh Interval Picker */}
            <div className="flex items-center gap-1 text-[11px] font-medium border-l border-slate-200 pl-2">
              <Timer className="h-3 w-3 text-slate-400 mr-0.5" />
              <button
                onClick={() => {
                  setAutoRefreshInterval(30);
                  setSecondsUntilRefresh(30);
                }}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  autoRefreshInterval === 30
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                30s
              </button>
              <button
                onClick={() => {
                  setAutoRefreshInterval(60);
                  setSecondsUntilRefresh(60);
                }}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  autoRefreshInterval === 60
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                1m
              </button>
              <button
                onClick={() => {
                  setAutoRefreshInterval(0);
                }}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  autoRefreshInterval === 0
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Off
              </button>
            </div>

            {/* Manual Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNews(activeCategory, true)}
              disabled={refreshing || loading}
              className="rounded-full text-xs border-slate-300 text-slate-800 hover:bg-white bg-white shadow-xs ml-auto sm:ml-0"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${
                  refreshing || loading ? "animate-spin text-blue-600" : ""
                }`}
              />
              {refreshing ? "Refreshing..." : "Refresh Feed"}
            </Button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medical topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 space-y-4 animate-pulse"
              >
                <div className="aspect-16/10 rounded-2xl bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-4/5" />
                <div className="h-16 bg-slate-200/70 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* News Grid with Zero-Breakdown Images */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between relative"
              >
                <div className="space-y-4">
                  {/* High-Resolution Safe Image Container */}
                  <div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                    <SafeMedicalImage
                      src={article.imageUrl}
                      alt={article.title}
                      category={article.category}
                    />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-sm backdrop-blur-xs border border-slate-200/60">
                        {article.category}
                      </span>
                    </div>

                    {/* Source & Date Pill */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] font-medium text-white px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md">
                      <span className="truncate max-w-[170px]">{article.source}</span>
                      <span className="flex items-center gap-1 opacity-90">
                        <Clock className="h-3 w-3" />
                        {new Date(article.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* AI Lightning Summary Card */}
                  {article.aiSummary && (
                    <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-3.5 space-y-1.5 relative overflow-hidden">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        <span className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                          <span>AI Lightning Summary</span>
                        </span>
                        {article.aiModel && (
                          <span className="text-[9px] text-blue-500 font-normal lowercase">
                            {article.aiModel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {article.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-600 pt-1">
                      {article.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Card Footer Link */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {article.readTime || "3 min read"}
                  </span>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Read Journal Article</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-slate-50 rounded-3xl border border-slate-200">
            <Newspaper className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No matching medical articles</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any articles matching &ldquo;{searchQuery}&rdquo;. Try another search term or switch categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="rounded-full text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Bottom Editorial & Refresh Meta Banner */}
        <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Medical Editorial & Real-Time Integrity Standards
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                CareConnect synchronizes directly with international medical news feeds and clinical trial registries, cross-checked with neural verification.
                {lastUpdated && (
                  <span className="block mt-1 text-[11px] text-blue-600">
                    Last wire update: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs border-slate-300 text-slate-800 hover:bg-white"
              asChild
            >
              <a href="/patient/ai/scanner">Launch Clinical AI Scanner →</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
