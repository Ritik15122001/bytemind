import { Router, Request, Response } from "express";
import Category from "../models/Category";
import Blog from "../models/Blog";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ blogCount: -1 });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:slug/blogs", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;

    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    const total = await Blog.countDocuments({ category: category._id, isPublished: true });
    const blogs = await Blog.find({ category: category._id, isPublished: true })
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-content");

    res.json({
      success: true,
      data: { category, blogs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } },
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
