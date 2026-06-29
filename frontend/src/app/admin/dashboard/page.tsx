"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAdminStore } from "@/store/useAdminStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { formatDate, formatRelative } from "@/lib/utils";
import Loading from "@/components/ui/Loading";
import { FiFileText, FiTag, FiEye, FiZap, FiRefreshCw, FiArrowRight, FiAlertCircle } from "react-icons/fi";

export default function DashboardPage() {
  const { stats, categories: adminCategories, generating, fetchStats, fetchCategories, generateAll, generateForCategory } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, [fetchStats, fetchCategories]);

  const statCards = stats
    ? [
        { icon: FiFileText, label: "Total Articles", value: stats.totalBlogs, color: "text-accent-purple", bg: "bg-accent-purple/10" },
        { icon: FiTag, label: "Categories", value: stats.totalCategories, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
        { icon: FiEye, label: "Total Views", value: stats.totalViews.toLocaleString(), color: "text-green-400", bg: "bg-green-500/10" },
        { icon: FiZap, label: "Auto Posts", value: "Daily ⚡", color: "text-yellow-400", bg: "bg-yellow-500/10" },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Dashboard</h1>
          <p className="text-text-muted mt-1">Manage your ByteMind blog</p>
        </div>
        <button
          onClick={generateAll}
          disabled={generating}
          className="flex items-center gap-2 bg-accent-purple hover:bg-accent-purple-light text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 shadow-lg shadow-purple-500/20"
        >
          <FiRefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating..." : "Generate All Blogs"}
        </button>
      </div>

      {!stats ? (
        <Loading />
      ) : (
        <>
          {/* Drafts banner */}
          <Link href="/admin/review"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 hover:bg-amber-100 transition-colors group">
            <FiAlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium text-amber-700 flex-1">
              New drafts are waiting for your review — humanize &amp; publish them before they go live.
            </p>
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              Review Drafts <FiArrowRight className="w-3 h-3" />
            </span>
          </Link>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="glass-card p-6 hover:border-accent-purple/30 transition-all">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-black text-text-primary">{value}</p>
                <p className="text-text-muted text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Posts */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-text-primary">Recent Articles</h2>
                <Link href="/admin/blogs" className="text-accent-cyan text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View all <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentBlogs.map((blog) => (
                  <div key={blog._id} className="flex items-start justify-between p-3 rounded-xl bg-bg-secondary hover:bg-bg-border/50 transition-colors">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-text-primary truncate">{blog.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {blog.categoryName} · {formatRelative(blog.publishedAt)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-text-muted flex-shrink-0">
                      <FiEye className="w-3 h-3" />{blog.views}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories with Generate buttons */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-text-primary">Generate by Category</h2>
                <Link href="/admin/categories" className="text-accent-cyan text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Manage <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {adminCategories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{cat.name}</p>
                        <p className="text-xs text-text-muted">{cat.blogCount} posts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => generateForCategory(cat._id)}
                      disabled={generating}
                      className="text-xs px-3 py-1.5 rounded-lg bg-accent-purple/10 text-accent-purple border border-accent-purple/20 hover:bg-accent-purple/20 transition-all disabled:opacity-40 font-medium"
                    >
                      <FiZap className="inline w-3 h-3 mr-1" />
                      Generate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
