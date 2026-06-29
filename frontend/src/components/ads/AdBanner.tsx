"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiZap, FiArrowRight, FiMail, FiShield, FiCpu, FiTrendingUp } from "react-icons/fi";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const HORIZONTAL_BANNERS = [
  {
    bg: "from-accent-purple/15 to-accent-cyan/10",
    border: "border-accent-purple/20",
    icon: FiZap,
    iconColor: "text-accent-purple",
    tag: "Daily Tech Insights",
    tagColor: "bg-accent-purple/15 text-accent-purple",
    title: "New AI articles drop every day at midnight",
    desc: "Stay ahead of the curve — fresh tech, AI, and programming content daily.",
    cta: "Browse All Articles",
    href: "/blog",
    ctaStyle: "bg-accent-purple hover:bg-accent-purple-light text-white",
  },
  {
    bg: "from-accent-cyan/15 to-blue-500/10",
    border: "border-accent-cyan/20",
    icon: FiCpu,
    iconColor: "text-accent-cyan",
    tag: "Artificial Intelligence",
    tagColor: "bg-accent-cyan/15 text-accent-cyan",
    title: "Explore the latest in AI & Machine Learning",
    desc: "From ChatGPT to autonomous agents — we cover everything AI so you don't have to.",
    cta: "Read AI Articles",
    href: "/category/artificial-intelligence",
    ctaStyle: "bg-accent-cyan hover:bg-cyan-400 text-bg-primary",
  },
  {
    bg: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    icon: FiTrendingUp,
    iconColor: "text-green-400",
    tag: "Tech Trends",
    tagColor: "bg-green-500/15 text-green-400",
    title: "Don't miss what's trending in tech right now",
    desc: "Cybersecurity, cloud computing, gadgets, and dev tools — all in one place.",
    cta: "See What's Trending",
    href: "/category/tech-news",
    ctaStyle: "bg-green-500 hover:bg-green-400 text-white",
  },
];

const RECTANGLE_BANNERS = [
  {
    bg: "from-accent-purple/10 to-bg-card",
    border: "border-accent-purple/20",
    icon: FiMail,
    iconColor: "text-accent-purple",
    title: "Get weekly tech digest",
    desc: "The best ByteMind articles, curated and delivered to your inbox every week. Free forever.",
    cta: "Subscribe Free",
    href: "#newsletter",
    ctaStyle: "bg-accent-purple hover:bg-accent-purple-light text-white",
    type: "newsletter" as const,
  },
  {
    bg: "from-accent-cyan/10 to-bg-card",
    border: "border-accent-cyan/20",
    icon: FiShield,
    iconColor: "text-accent-cyan",
    title: "Protect yourself online",
    desc: "Read our cybersecurity guides — learn how to stay safe, pick the best VPN, and more.",
    cta: "Security Guides",
    href: "/category/cybersecurity",
    ctaStyle: "bg-accent-cyan hover:bg-cyan-400 text-bg-primary",
    type: "promo" as const,
  },
  {
    bg: "from-yellow-500/10 to-bg-card",
    border: "border-yellow-500/20",
    icon: FiZap,
    iconColor: "text-yellow-400",
    title: "Best AI tools of 2024",
    desc: "We test and review the top AI productivity tools so you know exactly what's worth your time.",
    cta: "See AI Tools",
    href: "/category/ai-tools",
    ctaStyle: "bg-yellow-500 hover:bg-yellow-400 text-bg-primary",
    type: "promo" as const,
  },
];

function HorizontalBanner({ className }: { className: string }) {
  const [idx] = useState(() => Math.floor(Math.random() * HORIZONTAL_BANNERS.length));
  const b = HORIZONTAL_BANNERS[idx];
  const Icon = b.icon;

  return (
    <div className={`bg-gradient-to-r ${b.bg} border ${b.border} rounded-2xl p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${b.iconColor}`} />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${b.tagColor}`}>
              {b.tag}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-text-primary mt-1">{b.title}</h3>
            <p className="text-text-muted text-xs sm:text-sm hidden sm:block mt-0.5">{b.desc}</p>
          </div>
        </div>
        <Link
          href={b.href}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${b.ctaStyle}`}
        >
          {b.cta} <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function RectangleBanner({ className }: { className: string }) {
  const [idx] = useState(() => Math.floor(Math.random() * RECTANGLE_BANNERS.length));
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const b = RECTANGLE_BANNERS[idx];
  const Icon = b.icon;

  return (
    <div className={`bg-gradient-to-b ${b.bg} border ${b.border} rounded-2xl p-6 ${className}`}>
      <div className={`w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${b.iconColor}`} />
      </div>
      <h3 className="font-bold text-text-primary mb-2 text-sm leading-snug">{b.title}</h3>
      <p className="text-text-muted text-xs leading-relaxed mb-4">{b.desc}</p>

      {b.type === "newsletter" ? (
        submitted ? (
          <p className="text-green-400 text-xs font-medium">✅ You're subscribed!</p>
        ) : (
          <div className="space-y-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-secondary border border-bg-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
            />
            <button
              onClick={() => email && setSubmitted(true)}
              className={`w-full text-xs font-semibold py-2.5 rounded-lg transition-all ${b.ctaStyle}`}
            >
              {b.cta}
            </button>
          </div>
        )
      ) : (
        <Link
          href={b.href}
          className={`flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all ${b.ctaStyle}`}
        >
          {b.cta} <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

export default function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const hasAdsense = client && client !== "ca-pub-XXXXXXXXXXXXXXXXX";

  useEffect(() => {
    if (!hasAdsense) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [hasAdsense]);

  if (!hasAdsense) {
    if (format === "rectangle" || format === "vertical") {
      return <RectangleBanner className={className} />;
    }
    return <HorizontalBanner className={className} />;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
