"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategoryStore } from "@/store/useCategoryStore";
import { FiSearch, FiMenu, FiX, FiCpu, FiCode, FiShield, FiCloud, FiZap, FiSmartphone, FiTrendingUp, FiAward } from "react-icons/fi";
import Logo from "@/components/ui/Logo";

const CAT_ICONS: Record<string, React.ReactNode> = {
  "artificial-intelligence": <FiCpu className="w-4 h-4" />,
  "machine-learning":        <FiAward className="w-4 h-4" />,
  "programming":             <FiCode className="w-4 h-4" />,
  "cybersecurity":           <FiShield className="w-4 h-4" />,
  "cloud-devops":            <FiCloud className="w-4 h-4" />,
  "ai-tools":                <FiZap className="w-4 h-4" />,
  "gadgets":                 <FiSmartphone className="w-4 h-4" />,
  "tech-news":               <FiTrendingUp className="w-4 h-4" />,
};

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const mainNav = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-bg-border shadow-sm" : "bg-white border-b border-bg-border"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Logo />

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "text-accent-purple bg-purple-50"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                  }`}>
                  {item.label}
                </Link>
              ))}

              {/* Categories dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-all flex items-center gap-1">
                  Topics
                  <svg className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-bg-border rounded-xl shadow-card-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                  {categories.slice(0, 8).map((cat) => (
                    <Link key={cat._id} href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors group/item">
                      <span className="text-accent-purple group-hover/item:scale-110 transition-transform">
                        {CAT_ICONS[cat.slug] ?? <FiCpu className="w-4 h-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{cat.name}</p>
                        <p className="text-xs text-text-muted">{cat.blogCount} articles</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors" aria-label="Search">
                <FiSearch className="w-5 h-5" />
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors" aria-label="Menu">
                {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-bg-border">
            <div className="px-4 py-4 space-y-1">
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href ? "text-accent-purple bg-purple-50" : "text-text-secondary hover:bg-bg-secondary"
                  }`}>
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-bg-border mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Topics</p>
                {categories.slice(0, 8).map((cat) => (
                  <Link key={cat._id} href={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors">
                    <span className="text-accent-purple">{CAT_ICONS[cat.slug] ?? <FiCpu className="w-4 h-4" />}</span>
                    <span className="text-sm text-text-secondary">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white border border-bg-border rounded-2xl shadow-card-hover overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 p-4 border-b border-bg-border">
              <FiSearch className="w-5 h-5 text-text-muted flex-shrink-0" />
              <input type="text" placeholder="Search articles, topics, tech..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim())
                    window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
                  if (e.key === "Escape") setSearchOpen(false);
                }} />
              <button onClick={() => setSearchOpen(false)} className="p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              <p className="text-xs text-text-muted w-full mb-1">Popular topics:</p>
              {["ChatGPT", "Python", "Cybersecurity", "Machine Learning", "React"].map((t) => (
                <button key={t} onClick={() => { window.location.href = `/blog?search=${t}`; }}
                  className="text-xs px-3 py-1.5 bg-bg-secondary border border-bg-border rounded-full text-text-secondary hover:border-accent-purple hover:text-accent-purple transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
