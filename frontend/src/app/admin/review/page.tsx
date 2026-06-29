"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminAPI } from "@/lib/api";
import { Blog } from "@/types";
import { formatDate } from "@/lib/utils";
import Loading from "@/components/ui/Loading";
import { FiEye, FiTrash2, FiCheckCircle, FiClock, FiRefreshCw, FiFileText } from "react-icons/fi";

export default function ReviewDraftsPage() {
  const [drafts, setDrafts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDrafts();
      setDrafts(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDrafts(); }, []);

  const handlePublish = async (id: string) => {
    setPublishing(id);
    try {
      await adminAPI.publishBlog(id);
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await adminAPI.deleteBlog(id);
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Review Drafts</h1>
          <p className="text-text-muted mt-1">
            {drafts.length} article{drafts.length !== 1 ? "s" : ""} waiting for review
          </p>
        </div>
        <button onClick={loadDrafts}
          className="flex items-center gap-2 btn-secondary text-sm">
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-8 flex items-start gap-3">
        <FiFileText className="text-accent-purple w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-accent-purple">How the review flow works</p>
          <p className="text-sm text-text-secondary mt-1">
            All auto-generated blogs land here as drafts. Click <strong>Review & Edit</strong> to open the full article, humanize it with one click, edit any part, then publish when satisfied.
          </p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : drafts.length === 0 ? (
        <div className="text-center py-24 glass-card">
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-text-primary mb-2">No drafts pending</h2>
          <p className="text-text-muted text-sm">All caught up! Generate new blogs from the Dashboard.</p>
          <Link href="/admin/dashboard" className="btn-primary inline-flex mt-6 text-sm">Go to Dashboard</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft._id} className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-card-hover transition-all">
              {/* Cover thumbnail */}
              <div className="relative w-full sm:w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-bg-secondary">
                {draft.coverImage ? (
                  <Image src={draft.coverImage} alt={draft.title} fill className="object-cover" sizes="112px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-text-muted">📄</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-purple bg-purple-50 px-2 py-0.5 rounded-full">
                    {draft.categoryName}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <FiClock className="w-3 h-3" /> {draft.readTime} min
                  </span>
                </div>
                <h3 className="font-bold text-text-primary line-clamp-1 mb-1">{draft.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{draft.excerpt}</p>
                <p className="text-xs text-text-muted mt-1.5">
                  by {draft.author} · generated {formatDate(draft.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/review/${draft._id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent-purple text-white text-sm font-semibold rounded-lg hover:bg-accent-purple-light transition-colors">
                  <FiEye className="w-4 h-4" /> Review & Edit
                </Link>
                <button onClick={() => handlePublish(draft._id)} disabled={publishing === draft._id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60">
                  <FiCheckCircle className="w-4 h-4" />
                  {publishing === draft._id ? "..." : "Publish"}
                </button>
                <button onClick={() => handleDelete(draft._id)} disabled={deleting === draft._id}
                  className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-60">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
