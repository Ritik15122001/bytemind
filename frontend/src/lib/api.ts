import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("bytemind_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const blogAPI = {
  getAll: (params?: Record<string, string | number>) => api.get("/blogs", { params }),
  getFeatured: () => api.get("/blogs/featured"),
  getRecent: () => api.get("/blogs/recent"),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getCategoryBlogs: (slug: string, params?: Record<string, string | number>) =>
    api.get(`/categories/${slug}/blogs`, { params }),
};

export const adminAPI = {
  login: (email: string, password: string) => api.post("/admin/login", { email, password }),
  getStats: () => api.get("/admin/stats"),
  getBlogs: (params?: Record<string, number>) => api.get("/admin/blogs", { params }),
  getDrafts: () => api.get("/admin/drafts"),
  getBlogFull: (id: string) => api.get(`/admin/blogs/${id}/full`),
  updateBlog: (id: string, data: Record<string, unknown>) => api.put(`/admin/blogs/${id}`, data),
  publishBlog: (id: string) => api.post(`/admin/blogs/${id}/publish`),
  humanizeBlog: (id: string) => api.post(`/admin/blogs/${id}/humanize`),
  deleteBlog: (id: string) => api.delete(`/admin/blogs/${id}`),
  toggleBlog: (id: string) => api.patch(`/admin/blogs/${id}/toggle`),
  getCategories: () => api.get("/admin/categories"),
  createCategory: (data: Record<string, string>) => api.post("/admin/categories", data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  generateAll: () => api.post("/admin/generate/all"),
  generateForCategory: (categoryId: string) => api.post(`/admin/generate/${categoryId}`),
};

export default api;
