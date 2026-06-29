import { create } from "zustand";
import { Blog, Category, AdminStats, Pagination } from "@/types";
import { adminAPI } from "@/lib/api";

interface AdminStore {
  isAuthenticated: boolean;
  adminInfo: { email: string; name: string } | null;
  stats: AdminStats | null;
  blogs: Blog[];
  categories: Category[];
  pagination: Pagination | null;
  isLoading: boolean;
  generating: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  fetchStats: () => Promise<void>;
  fetchBlogs: (params?: Record<string, number>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  toggleBlog: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createCategory: (data: Record<string, string>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  generateAll: () => Promise<void>;
  generateForCategory: (categoryId: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  adminInfo: null,
  stats: null,
  blogs: [],
  categories: [],
  pagination: null,
  isLoading: false,
  generating: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminAPI.login(email, password);
      localStorage.setItem("bytemind_token", res.data.token);
      localStorage.setItem("bytemind_admin", JSON.stringify(res.data.admin));
      set({ isAuthenticated: true, adminInfo: res.data.admin, isLoading: false });
      return true;
    } catch {
      set({ error: "Invalid credentials", isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("bytemind_token");
    localStorage.removeItem("bytemind_admin");
    set({ isAuthenticated: false, adminInfo: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem("bytemind_token");
    const admin = localStorage.getItem("bytemind_admin");
    if (token && admin) {
      set({ isAuthenticated: true, adminInfo: JSON.parse(admin) });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const res = await adminAPI.getStats();
      set({ stats: res.data.data, isLoading: false });
    } catch {
      set({ error: "Failed to fetch stats", isLoading: false });
    }
  },

  fetchBlogs: async (params) => {
    set({ isLoading: true });
    try {
      const res = await adminAPI.getBlogs(params);
      set({ blogs: res.data.data, pagination: res.data.pagination, isLoading: false });
    } catch {
      set({ error: "Failed to fetch blogs", isLoading: false });
    }
  },

  deleteBlog: async (id) => {
    await adminAPI.deleteBlog(id);
    set({ blogs: get().blogs.filter((b) => b._id !== id) });
  },

  toggleBlog: async (id) => {
    const res = await adminAPI.toggleBlog(id);
    set({ blogs: get().blogs.map((b) => (b._id === id ? { ...b, isPublished: res.data.data.isPublished } : b)) });
  },

  fetchCategories: async () => {
    const res = await adminAPI.getCategories();
    set({ categories: res.data.data });
  },

  createCategory: async (data) => {
    const res = await adminAPI.createCategory(data);
    set({ categories: [res.data.data, ...get().categories] });
  },

  deleteCategory: async (id) => {
    await adminAPI.deleteCategory(id);
    set({ categories: get().categories.filter((c) => c._id !== id) });
  },

  generateAll: async () => {
    set({ generating: true });
    try {
      await adminAPI.generateAll();
    } finally {
      set({ generating: false });
    }
  },

  generateForCategory: async (categoryId) => {
    set({ generating: true });
    try {
      await adminAPI.generateForCategory(categoryId);
    } finally {
      set({ generating: false });
    }
  },
}));
