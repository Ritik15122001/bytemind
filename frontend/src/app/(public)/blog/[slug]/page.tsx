"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useBlogStore } from "@/store/useBlogStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import Loading from "@/components/ui/Loading";
import CategoryBadge from "@/components/ui/CategoryBadge";
import BlogCard from "@/components/blog/BlogCard";
import AdBanner from "@/components/ads/AdBanner";
import { formatDate } from "@/lib/utils";
import { FiClock, FiEye, FiCalendar, FiTag, FiArrowLeft } from "react-icons/fi";
import { Category } from "@/types";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { currentBlog, recentBlogs, isLoading, error, fetchBlogBySlug, fetchRecent } = useBlogStore();
  const { fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
      fetchRecent();
      fetchCategories();
    }
  }, [slug, fetchBlogBySlug, fetchRecent, fetchCategories]);

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Loading />
    </div>
  );

  if (error || !currentBlog) return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-4">😕</p>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Article Not Found</h1>
      <p className="text-text-muted mb-6">This article doesn't exist or was removed.</p>
      <Link href="/blog" className="btn-primary">Browse All Articles</Link>
    </div>
  );

  const category = currentBlog.category as Category;

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bytemind.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": currentBlog.title,
    "description": currentBlog.excerpt || currentBlog.title,
    "image": currentBlog.coverImage ? `${SITE_URL}${currentBlog.coverImage}` : `${SITE_URL}/og-image.png`,
    "author": { "@type": "Person", "name": currentBlog.author || "ByteMind Editorial" },
    "publisher": {
      "@type": "Organization",
      "name": "ByteMind",
      "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/favicon.svg` },
    },
    "datePublished": currentBlog.publishedAt,
    "dateModified": currentBlog.publishedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${currentBlog.slug}` },
    "keywords": currentBlog.tags?.join(", ") || "",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-3">
            {/* Back button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-8 transition-colors group"
            >
              <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>

            {/* Category */}
            {category && typeof category === "object" && (
              <div className="mb-4">
                <CategoryBadge name={category.name} slug={category.slug} color={category.color} icon={category.icon} size="md" />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary leading-tight mb-6">
              {currentBlog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm mb-8 pb-8 border-b border-bg-border">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-xs font-bold text-white">
                  {currentBlog.author?.[0] ?? "B"}
                </div>
                <span className="font-medium text-text-secondary">{currentBlog.author}</span>
              </span>
              <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />{formatDate(currentBlog.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4" />{currentBlog.readTime} min read</span>
              <span className="flex items-center gap-1.5"><FiEye className="w-4 h-4" />{currentBlog.views} views</span>
            </div>

            {/* Cover Image */}
            {currentBlog.coverImage && (
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-10">
                <Image
                  src={currentBlog.coverImage}
                  alt={currentBlog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
              </div>
            )}

            {/* In-content Ad */}
            <AdBanner slot="3344556677" format="horizontal" className="mb-8" />

            {/* Blog Content */}
            <div className="blog-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentBlog.content || ""}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-bg-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <FiTag className="text-text-muted w-4 h-4" />
                  {currentBlog.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="text-xs px-3 py-1.5 rounded-full bg-bg-card border border-bg-border text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Ad */}
            <div className="mt-10">
              <AdBanner slot="7788990011" format="rectangle" />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24">
              <AdBanner slot="4455667788" format="rectangle" className="mb-6" />

              {/* Related Posts */}
              <div className="glass-card p-5">
                <h3 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-wider">
                  More Articles
                </h3>
                <div className="space-y-3">
                  {recentBlogs
                    .filter((b) => b._id !== currentBlog._id)
                    .slice(0, 5)
                    .map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>
              </div>

              <AdBanner slot="9900112233" format="rectangle" className="mt-6" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
