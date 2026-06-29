"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCategoryStore } from "@/store/useCategoryStore";
import BlogGrid from "@/components/blog/BlogGrid";
import AdBanner from "@/components/ads/AdBanner";
import { FiArrowLeft } from "react-icons/fi";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { currentCategory, categoryBlogs, pagination, isLoading, fetchCategoryBlogs } = useCategoryStore();

  useEffect(() => {
    if (slug) fetchCategoryBlogs(slug, { page, limit: 9 });
  }, [slug, page, fetchCategoryBlogs]);

  if (!isLoading && !currentCategory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Category Not Found</h1>
        <Link href="/blog" className="btn-primary">Browse All Articles</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-8 transition-colors group"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          All Articles
        </Link>

        {currentCategory && (
          <div className="mb-12">
            <div
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: `${currentCategory.color}15`, color: currentCategory.color, border: `1px solid ${currentCategory.color}30` }}
            >
              <span className="text-2xl">{currentCategory.icon}</span>
              {currentCategory.name}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">{currentCategory.description}</p>
            <p className="text-text-muted text-sm mt-3">{currentCategory.blogCount} articles published</p>
          </div>
        )}

        <AdBanner slot="6677889900" format="horizontal" className="mb-10" />

        <BlogGrid blogs={categoryBlogs} loading={isLoading} featured columns={3} />

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-bg-card border border-bg-border text-sm text-text-secondary disabled:opacity-50 hover:border-accent-purple transition-all"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  p === page ? "bg-accent-purple text-white" : "bg-bg-card border border-bg-border text-text-secondary hover:border-accent-purple"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg bg-bg-card border border-bg-border text-sm text-text-secondary disabled:opacity-50 hover:border-accent-purple transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
