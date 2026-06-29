"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { FiRss, FiMail, FiCpu, FiCode, FiShield, FiCloud, FiZap, FiSmartphone, FiTrendingUp, FiAward } from "react-icons/fi";

const CATEGORIES = [
  { label: "Artificial Intelligence", href: "/category/artificial-intelligence", icon: <FiCpu /> },
  { label: "Machine Learning",        href: "/category/machine-learning",        icon: <FiAward /> },
  { label: "Programming",             href: "/category/programming",             icon: <FiCode /> },
  { label: "Cybersecurity",           href: "/category/cybersecurity",           icon: <FiShield /> },
  { label: "Cloud & DevOps",          href: "/category/cloud-devops",            icon: <FiCloud /> },
  { label: "AI Tools",                href: "/category/ai-tools",                icon: <FiZap /> },
  { label: "Gadgets & Reviews",       href: "/category/gadgets",                 icon: <FiSmartphone /> },
  { label: "Tech News",               href: "/category/tech-news",               icon: <FiTrendingUp /> },
];

const LINKS = [
  { label: "Home",           href: "/" },
  { label: "Blog",           href: "/blog" },
  { label: "About",          href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Sitemap",        href: "/sitemap.xml" },
];

export default function Footer() {
  return (
    <footer className="border-t border-bg-border bg-bg-secondary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-5">
              Practical tech journalism for developers, engineers, and curious minds. AI, programming, cybersecurity &mdash; no hype, just depth.
            </p>
            <div className="flex items-center gap-2">
              <a href="/rss.xml" aria-label="RSS Feed"
                className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent-purple border border-bg-border hover:border-accent-purple px-3 py-1.5 rounded-full transition-all">
                <FiRss className="w-3.5 h-3.5" /> RSS Feed
              </a>
              <a href="mailto:contact@bytemind.io" aria-label="Contact"
                className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent-cyan border border-bg-border hover:border-accent-cyan px-3 py-1.5 rounded-full transition-all">
                <FiMail className="w-3.5 h-3.5" /> Contact
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-xs uppercase tracking-widest">Topics</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-purple transition-colors group">
                    <span className="opacity-60 group-hover:opacity-100 transition-opacity">{cat.icon}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-xs uppercase tracking-widest">Navigate</h3>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-muted hover:text-accent-purple transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-text-primary mt-8 mb-4 text-xs uppercase tracking-widest">Popular</h3>
            <ul className="space-y-2.5">
              {["Best AI Tools 2024", "Python for Beginners", "Cybersecurity Guide", "React vs Next.js"].map((t) => (
                <li key={t}>
                  <Link href={`/blog?search=${encodeURIComponent(t)}`}
                    className="text-sm text-text-muted hover:text-accent-purple transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About the site */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4 text-xs uppercase tracking-widest">About ByteMind</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              ByteMind covers AI, developer tools, cloud, and cybersecurity — topics that matter to builders and tech professionals worldwide.
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              New articles every day. Built for curious people who want real answers, not clickbait.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["AI", "Python", "DevOps", "Security", "Cloud"].map((tag) => (
                <Link key={tag} href={`/blog?search=${tag}`}
                  className="text-xs px-2.5 py-1 border border-bg-border rounded-full text-text-muted hover:border-accent-purple hover:text-accent-purple transition-all">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-bg-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-sm">© {new Date().getFullYear()} ByteMind. All rights reserved.</p>
          <p className="text-text-muted text-xs">
            <Link href="/privacy" className="hover:text-accent-purple transition-colors">Privacy</Link>
            {" · "}
            <Link href="/sitemap.xml" className="hover:text-accent-purple transition-colors">Sitemap</Link>
            {" · "}
            <span>Built with Next.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
