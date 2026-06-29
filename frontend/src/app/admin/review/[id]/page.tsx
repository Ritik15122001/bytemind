"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { adminAPI } from "@/lib/api";
import { Blog } from "@/types";
import Loading from "@/components/ui/Loading";
import {
  FiArrowLeft, FiEdit2, FiEye, FiCheckCircle, FiZap,
  FiSave, FiAlertCircle, FiClock, FiTag,
} from "react-icons/fi";

type Tab = "preview" | "edit";

export default function ReviewBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("preview");
  const [humanizing, setHumanizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [dirty, setDirty] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadBlog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getBlogFull(id);
      const b: Blog = res.data.data;
      setBlog(b);
      setTitle(b.title);
      setContent(b.content || "");
      setExcerpt(b.excerpt);
      setAuthor(b.author);
      setDirty(false);
    } catch {
      showToast("Failed to load blog", "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadBlog(); }, [loadBlog]);

  const handleHumanize = async () => {
    setHumanizing(true);
    try {
      const res = await adminAPI.humanizeBlog(id);
      const b: Blog = res.data.data;
      setBlog(b);
      setTitle(b.title);
      setContent(b.content || "");
      setExcerpt(b.excerpt);
      setDirty(false);
      setTab("preview");
      showToast("✅ Article humanized — review the changes!");
    } catch {
      showToast("Humanize failed — try again", "error");
    } finally {
      setHumanizing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateBlog(id, { title, content, excerpt, author });
      setBlog(res.data.data);
      setDirty(false);
      showToast("Changes saved");
    } catch {
      showToast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (dirty) await handleSave();
    setPublishing(true);
    try {
      await adminAPI.publishBlog(id);
      showToast("🎉 Published! Redirecting...");
      setTimeout(() => router.push("/admin/review"), 1500);
    } catch {
      showToast("Publish failed", "error");
      setPublishing(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loading /></div>;
  if (!blog) return (
    <div className="text-center py-20">
      <p className="text-text-muted">Blog not found.</p>
      <Link href="/admin/review" className="btn-primary inline-flex mt-4 text-sm">← Back</Link>
    </div>
  );

  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 225);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-card-hover text-sm font-semibold transition-all ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link href="/admin/review" className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Drafts
        </Link>
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              Unsaved changes
            </span>
          )}
          <button onClick={handleHumanize} disabled={humanizing}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 text-accent-purple text-sm font-semibold rounded-xl hover:bg-purple-100 transition-all disabled:opacity-60">
            <FiZap className={`w-4 h-4 ${humanizing ? "animate-pulse" : ""}`} />
            {humanizing ? "Humanizing…" : "Humanize"}
          </button>
          {dirty && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary border border-bg-border text-text-primary text-sm font-semibold rounded-xl hover:border-accent-purple transition-all disabled:opacity-60">
              <FiSave className="w-4 h-4" />
              {saving ? "Saving…" : "Save"}
            </button>
          )}
          <button onClick={handlePublish} disabled={publishing || humanizing}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm">
            <FiCheckCircle className="w-4 h-4" />
            {publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Article meta strip */}
      <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
        <span className="font-semibold text-accent-purple bg-purple-50 px-3 py-1 rounded-full text-xs">
          {blog.categoryName}
        </span>
        <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4" />{readTime} min read · {wordCount.toLocaleString()} words</span>
        <span className="flex items-center gap-1.5"><FiTag className="w-4 h-4" />{blog.focusKeyword}</span>
        <span>by <strong className="text-text-primary">{author}</strong></span>
        <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
          blog.isPublished ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
        }`}>
          {blog.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Humanize hint */}
      {!humanizing && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3 text-sm">
          <FiZap className="text-accent-purple w-4 h-4 flex-shrink-0" />
          <span className="text-text-secondary">
            Hit <strong className="text-accent-purple">Humanize</strong> to rewrite this article with natural language and personality, then review the changes and publish.
          </span>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-bg-secondary border border-bg-border rounded-xl mb-6 w-fit">
        <button onClick={() => setTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "preview" ? "bg-white text-text-primary shadow-card" : "text-text-muted hover:text-text-primary"
          }`}>
          <FiEye className="w-4 h-4" /> Preview
        </button>
        <button onClick={() => setTab("edit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "edit" ? "bg-white text-text-primary shadow-card" : "text-text-muted hover:text-text-primary"
          }`}>
          <FiEdit2 className="w-4 h-4" /> Edit
        </button>
      </div>

      {tab === "preview" ? (
        <div className="glass-card p-8">
          {/* Title preview */}
          <h1 className="text-3xl font-black text-text-primary mb-4 leading-tight">{title}</h1>
          <p className="text-text-secondary mb-8 pb-8 border-b border-bg-border text-lg leading-relaxed">{excerpt}</p>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-bg-secondary border border-bg-border text-text-muted">#{t}</span>
              ))}
            </div>
          )}

          {/* Content rendered */}
          <div className="blog-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Title editor */}
          <div className="glass-card p-5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Title</label>
            <input type="text" value={title}
              onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
              className="w-full text-xl font-bold text-text-primary bg-transparent border-0 outline-none placeholder-text-muted focus:ring-0 p-0"
              placeholder="Article title..." />
          </div>

          {/* Excerpt editor */}
          <div className="glass-card p-5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Excerpt <span className="text-text-muted font-normal">({excerpt.length}/280 chars)</span>
            </label>
            <textarea value={excerpt} rows={3}
              onChange={(e) => { setExcerpt(e.target.value); setDirty(true); }}
              className="w-full text-sm text-text-secondary bg-transparent border-0 outline-none resize-none placeholder-text-muted leading-relaxed"
              placeholder="Short summary shown in blog cards..." />
          </div>

          {/* Author editor */}
          <div className="glass-card p-5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Author</label>
            <input type="text" value={author}
              onChange={(e) => { setAuthor(e.target.value); setDirty(true); }}
              className="w-full text-sm font-medium text-text-primary bg-transparent border-0 outline-none"
              placeholder="Author name..." />
          </div>

          {/* Content editor */}
          <div className="glass-card p-5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Content — Markdown <span className="text-text-muted font-normal">({wordCount.toLocaleString()} words)</span>
            </label>
            <textarea value={content} rows={40}
              onChange={(e) => { setContent(e.target.value); setDirty(true); }}
              className="w-full text-sm text-text-secondary bg-bg-secondary border border-bg-border rounded-lg p-4 font-mono leading-7 outline-none focus:border-accent-purple transition-colors resize-y"
              placeholder="Write markdown content here..." />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !dirty}
              className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-40">
              <FiSave className="w-4 h-4" />{saving ? "Saving…" : "Save Changes"}
            </button>
            <button onClick={handlePublish} disabled={publishing}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
              <FiCheckCircle className="w-4 h-4" />{publishing ? "Publishing…" : "Save & Publish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
