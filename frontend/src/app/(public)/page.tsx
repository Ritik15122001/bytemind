"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import Link from "next/link";
import { useBlogStore } from "@/store/useBlogStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogCard from "@/components/blog/BlogCard";
import AdBanner from "@/components/ads/AdBanner";
import { FiArrowRight, FiCpu, FiCode, FiShield, FiCloud, FiZap, FiSmartphone, FiTrendingUp, FiAward, FiBookOpen } from "react-icons/fi";

const CAT_ICONS: Record<string, React.ReactNode> = {
  "artificial-intelligence": <FiCpu />,
  "machine-learning":        <FiAward />,
  "programming":             <FiCode />,
  "cybersecurity":           <FiShield />,
  "cloud-devops":            <FiCloud />,
  "ai-tools":                <FiZap />,
  "gadgets":                 <FiSmartphone />,
  "tech-news":               <FiTrendingUp />,
};

export default function HomePage() {
  const { featuredBlogs, recentBlogs, isLoading, fetchFeatured, fetchRecent } = useBlogStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchFeatured();
    fetchRecent();
    fetchCategories();
  }, [fetchFeatured, fetchRecent, fetchCategories]);

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ByteMind",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://bytemind.vercel.app",
    "description": "Expert articles on AI, machine learning, programming, cybersecurity, and developer tools.",
    "publisher": { "@type": "Organization", "name": "ByteMind" },
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://bytemind.vercel.app"}/blog?search={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-20 px-4">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-16 left-1/4 w-80 h-80 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/5 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-semibold mb-8">
            <FiZap className="w-3.5 h-3.5" />
            New articles every day
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.08] tracking-tight text-text-primary">
            Tech insights that{" "}
            <span className="gradient-text">actually matter</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Deep dives into AI, machine learning, programming, cybersecurity, and cloud — written by people who live and breathe tech.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog" className="btn-primary flex items-center justify-center gap-2 text-base px-6 py-3">
              <FiBookOpen className="w-4 h-4" /> Read Latest Articles
            </Link>
            <Link href="/category/artificial-intelligence" className="btn-secondary flex items-center justify-center gap-2 text-base px-6 py-3">
              <FiCpu className="w-4 h-4" /> Explore AI
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category Pills ── */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/blog"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              <FiBookOpen className="w-3.5 h-3.5" /> All Posts
            </Link>
            {categories.map((cat) => (
              <Link key={cat._id} href={`/category/${cat.slug}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-text-secondary bg-white border border-bg-border hover:border-accent-purple/60 hover:text-accent-purple transition-all duration-200">
                <span className="text-accent-purple opacity-80">
                  {CAT_ICONS[cat.slug] ?? <FiCpu className="w-3.5 h-3.5" />}
                </span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad ── */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <AdBanner slot="1234567890" format="horizontal" className="w-full" />
      </div>

      {/* ── Featured ── */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-accent-purple to-accent-cyan rounded-full" />
              <h2 className="text-2xl font-bold text-text-primary">Featured Articles</h2>
            </div>
            <Link href="/blog" className="flex items-center gap-1 text-accent-cyan text-sm font-medium hover:gap-2 transition-all">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <BlogGrid blogs={featuredBlogs} loading={isLoading} featured columns={3} />
        </div>
      </section>

      {/* ── Recent + Sidebar ── */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-accent-purple to-accent-cyan rounded-full" />
              <h2 className="text-2xl font-bold text-text-primary">Recent Articles</h2>
            </div>
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="btn-secondary inline-flex items-center gap-2">
                All Articles <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <AdBanner slot="0987654321" format="rectangle" />

            {/* Topics Widget */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-accent-purple" /> Browse by Topic
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <Link key={cat._id} href={`/category/${cat.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <span className="text-accent-purple opacity-75 group-hover:opacity-100 transition-opacity">
                        {CAT_ICONS[cat.slug] ?? <FiCpu className="w-4 h-4" />}
                      </span>
                      <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${cat.color}18`, color: cat.color }}>
                      {cat.blogCount}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <AdBanner slot="1122334455" format="rectangle" />
          </aside>
        </div>
      </section>

      {/* ── Bottom Ad ── */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <AdBanner slot="5544332211" format="horizontal" className="w-full" />
      </div>
    </div>
  );
}
