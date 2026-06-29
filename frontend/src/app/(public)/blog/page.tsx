"use client";
export const dynamic = "force-dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBlogStore } from "@/store/useBlogStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import BlogGrid from "@/components/blog/BlogGrid";
import AdBanner from "@/components/ads/AdBanner";
import Loading from "@/components/ui/Loading";
import { FiSearch, FiFilter } from "react-icons/fi";

function BlogContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);

  const { blogs, pagination, isLoading, fetchBlogs } = useBlogStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params: Record<string, string | number> = { page, limit: 9 };
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    fetchBlogs(params);
  }, [page, search, selectedCategory, fetchBlogs]);

  return (
    <>
      {/* Filters */}
      <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-bg-secondary border border-bg-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-text-muted w-4 h-4 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="bg-bg-secondary border border-bg-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-purple transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <AdBanner slot="2233445566" format="horizontal" className="mb-8" />

      {pagination && (
        <p className="text-text-muted text-sm mb-6">
          Showing {blogs.length} of {pagination.total} articles
        </p>
      )}

      <BlogGrid blogs={blogs} loading={isLoading} featured columns={3} />

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-bg-card border border-bg-border text-sm text-text-secondary disabled:opacity-50 hover:border-accent-purple hover:text-text-primary transition-all"
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? "bg-accent-purple text-white"
                  : "bg-bg-card border border-bg-border text-text-secondary hover:border-accent-purple"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 rounded-lg bg-bg-card border border-bg-border text-sm text-text-secondary disabled:opacity-50 hover:border-accent-purple hover:text-text-primary transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            All <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Explore our full library of tech, AI, and programming content.
          </p>
        </div>
        <Suspense fallback={<Loading />}>
          <BlogContent />
        </Suspense>
      </div>
    </div>
  );
}
