import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import blogRoutes from "./routes/blogRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import adminRoutes from "./routes/adminRoutes";
import { startScheduler } from "./services/schedulerService";
import Admin from "./models/Admin";
import Category from "./models/Category";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "ByteMind API running 🚀" });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);

const seedDatabase = async () => {
  const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: "ByteMind Admin",
    });
    console.log("✅ Admin account created");
  }

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    const defaultCategories = [
      { name: "Artificial Intelligence", slug: "artificial-intelligence", description: "Explore the latest in AI — from GPT models to autonomous agents and beyond.", color: "#7c3aed", icon: "🤖" },
      { name: "Machine Learning", slug: "machine-learning", description: "Deep dives into ML algorithms, model training, and data science techniques.", color: "#2563eb", icon: "🧠" },
      { name: "Programming", slug: "programming", description: "Coding tutorials, tips, and best practices for developers of all levels.", color: "#16a34a", icon: "💻" },
      { name: "Cybersecurity", slug: "cybersecurity", description: "Stay safe online — security news, tools, and how-to guides for everyone.", color: "#dc2626", icon: "🔒" },
      { name: "Gadgets & Reviews", slug: "gadgets", description: "Honest reviews and comparisons of the latest tech gadgets and devices.", color: "#ea580c", icon: "📱" },
      { name: "Cloud & DevOps", slug: "cloud-devops", description: "Cloud computing, containerization, CI/CD, and modern infrastructure guides.", color: "#0891b2", icon: "☁️" },
      { name: "Tech News", slug: "tech-news", description: "The most important technology news and industry insights, explained simply.", color: "#65a30d", icon: "📰" },
      { name: "AI Tools", slug: "ai-tools", description: "Discover and master the best AI tools to supercharge your productivity.", color: "#d97706", icon: "⚡" },
    ];
    await Category.insertMany(defaultCategories);
    console.log("✅ Default categories seeded");
  }
};

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately so Render health check passes, then connect DB
app.listen(PORT, () => {
  console.log(`🚀 ByteMind API running on port ${PORT}`);
});

const start = async () => {
  await connectDB();
  await seedDatabase();
  startScheduler();
};

start().catch((err) => {
  console.error("Startup error:", err.message);
});
