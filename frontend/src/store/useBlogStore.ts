import { create } from "zustand";
import { Blog, Pagination } from "@/types";
import { blogAPI } from "@/lib/api";

interface BlogStore {
  blogs: Blog[];
  featuredBlogs: Blog[];
  recentBlogs: Blog[];
  currentBlog: Blog | null;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  fetchBlogs: (params?: Record<string, string | number>) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchRecent: () => Promise<void>;
  fetchBlogBySlug: (slug: string) => Promise<void>;
  clearCurrentBlog: () => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],
  featuredBlogs: [],
  recentBlogs: [],
  currentBlog: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchBlogs: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await blogAPI.getAll(params);
      set({ blogs: res.data.data, pagination: res.data.pagination, isLoading: false });
    } catch {
      set({ error: "Failed to fetch blogs", isLoading: false });
    }
  },

  fetchFeatured: async () => {
    try {
      const res = await blogAPI.getFeatured();
      set({ featuredBlogs: res.data.data });
    } catch {
      set({ error: "Failed to fetch featured blogs" });
    }
  },

  fetchRecent: async () => {
    try {
      const res = await blogAPI.getRecent();
      set({ recentBlogs: res.data.data });
    } catch {
      set({ error: "Failed to fetch recent blogs" });
    }
  },

  fetchBlogBySlug: async (slug) => {
    set({ isLoading: true, error: null, currentBlog: null });
    try {
      const res = await blogAPI.getBySlug(slug);
      set({ currentBlog: res.data.data, isLoading: false });
    } catch {
      set({ error: "Blog not found", isLoading: false });
    }
  },

  clearCurrentBlog: () => set({ currentBlog: null }),
}));
