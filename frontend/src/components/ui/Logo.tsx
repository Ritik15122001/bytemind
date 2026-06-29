import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Logo({ size = "md", href = "/" }: LogoProps) {
  const dims = { sm: { icon: 28, font: "text-lg" }, md: { icon: 34, font: "text-xl" }, lg: { icon: 44, font: "text-3xl" } }[size];

  const mark = (
    <svg width={dims.icon} height={dims.icon} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bm-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect width="44" height="44" rx="12" fill="url(#bm-grad)" />
      {/* B letterform made of two horizontal bars + vertical bar */}
      <rect x="12" y="10" width="4" height="24" rx="2" fill="white" />
      <rect x="12" y="10" width="13" height="4" rx="2" fill="white" />
      <rect x="12" y="20" width="12" height="4" rx="2" fill="white" />
      <rect x="12" y="30" width="14" height="4" rx="2" fill="white" />
      <path d="M25 12 Q32 12 32 18 Q32 22 25 22" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M25 22 Q33 22 33 29 Q33 34 25 34" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Dot accent — cyan spark */}
      <circle cx="34" cy="11" r="4" fill="#22d3ee" />
    </svg>
  );

  const wordmark = (
    <span className={`font-black tracking-tight ${dims.font} leading-none select-none`}>
      <span className="gradient-text">Byte</span>
      <span className="text-text-primary">Mind</span>
    </span>
  );

  if (!href) {
    return <div className="flex items-center gap-2.5">{mark}{wordmark}</div>;
  }

  return (
    <Link href={href} className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
      <div className="group-hover:scale-105 transition-transform duration-200">{mark}</div>
      {wordmark}
    </Link>
  );
}
