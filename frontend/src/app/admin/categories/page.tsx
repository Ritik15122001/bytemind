"use client";
import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { FiPlus, FiTrash2, FiRefreshCw } from "react-icons/fi";

const COLORS = ["#7c3aed", "#2563eb", "#16a34a", "#dc2626", "#ea580c", "#0891b2", "#65a30d", "#d97706"];
const ICONS = ["🤖", "🧠", "💻", "🔒", "📱", "☁️", "📰", "⚡", "🎮", "🔬", "📊", "🌐"];

export default function AdminCategoriesPage() {
  const { categories, generating, fetchCategories, createCategory, deleteCategory, generateForCategory } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: COLORS[0], icon: ICONS[0] });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory(form);
    setForm({ name: "", description: "", color: COLORS[0], icon: ICONS[0] });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Categories</h1>
          <p className="text-text-muted mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 btn-primary text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="font-bold text-text-primary mb-4">New Category</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Artificial Intelligence"
                className="w-full bg-bg-secondary border border-bg-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                      form.icon === icon ? "bg-accent-purple/20 border-2 border-accent-purple" : "bg-bg-secondary border border-bg-border hover:border-accent-purple/50"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                placeholder="Brief description of this category"
                className="w-full bg-bg-secondary border border-bg-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1 uppercase tracking-wider">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`w-8 h-8 rounded-full transition-all ${form.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-bg-primary scale-110" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-end gap-3">
              <button type="submit" className="btn-primary text-sm px-6">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm px-6">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="glass-card p-5 hover:border-accent-purple/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm">{cat.name}</h3>
                  <p className="text-xs text-text-muted">{cat.blogCount} posts</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => generateForCategory(cat._id)}
                  disabled={generating}
                  className="p-1.5 rounded-lg text-text-muted hover:text-yellow-400 hover:bg-yellow-500/10 transition-all disabled:opacity-40"
                  title="Generate blog for this category"
                >
                  <FiRefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                </button>
                {confirmDelete === cat._id ? (
                  <div className="flex gap-1">
                    <button onClick={() => { deleteCategory(cat._id); setConfirmDelete(null); }} className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-xs px-2 py-1 bg-bg-border text-text-muted rounded-lg">No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(cat._id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-text-muted line-clamp-2">{cat.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-xs text-text-muted font-mono">{cat.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
