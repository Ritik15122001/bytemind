import { create } from "zustand";
import { Category, Blog, Pagination } from "@/types";
import { categoryAPI } from "@/lib/api";

interface CategoryStore {
  categories: Category[];
  currentCategory: Category | null;
  categoryBlogs: Blog[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchCategoryBlogs: (slug: string, params?: Record<string, string | number>) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  currentCategory: null,
  categoryBlogs: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await categoryAPI.getAll();
      set({ categories: res.data.data, isLoading: false });
    } catch {
      set({ error: "Failed to fetch categories", isLoading: false });
    }
  },

  fetchCategoryBlogs: async (slug, params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryAPI.getCategoryBlogs(slug, params);
      set({
        currentCategory: res.data.data.category,
        categoryBlogs: res.data.data.blogs,
        pagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch {
      set({ error: "Failed to fetch category blogs", isLoading: false });
    }
  },
}));
