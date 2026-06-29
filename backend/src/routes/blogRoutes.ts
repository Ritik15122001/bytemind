import { Router, Request, Response } from "express";
import Blog from "../models/Blog";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const tag = req.query.tag as string;
    const search = req.query.search as string;

    const query: Record<string, unknown> = { isPublished: true };
    if (category) query.categoryName = { $regex: new RegExp(category, "i") };
    if (tag) query.tags = { $in: [tag] };
    if (search) query.$text = { $search: search };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-content")
      .populate("category", "name slug color icon");

    // Cache list for 5 minutes on CDN
    res.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    res.json({
      success: true,
      data: blogs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/featured", async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ views: -1, publishedAt: -1 })
      .limit(6)
      .select("-content")
      .populate("category", "name slug color icon");
    res.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=120");
    res.json({ success: true, data: blogs });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/recent", async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(8)
      .select("-content")
      .populate("category", "name slug color icon");
    res.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    res.json({ success: true, data: blogs });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate(
      "category",
      "name slug color icon"
    );
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    // Cache individual articles for 1 hour (content rarely changes)
    res.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=300");
    res.json({ success: true, data: blog });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
