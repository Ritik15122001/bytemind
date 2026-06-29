// One-shot script: rewrite all blogs under 700 words directly via Groq, save to MongoDB
const Groq = require("groq-sdk").default || require("groq-sdk");
const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BlogSchema = new mongoose.Schema({
  title: String, content: String, excerpt: String,
}, { strict: false });
const Blog = mongoose.model("Blog", BlogSchema);

const AUTHORS = [
  "Aryan Mehta", "Priya Sharma", "Rohan Verma", "Sneha Kapoor",
  "Dev Patel", "Ritik Kumar", "Ananya Singh", "Karan Joshi",
];

async function generateLongArticle(title, author) {
  const prompt = `You are ${author}, a senior tech writer at ByteMind with 9 years of hands-on experience.

Write a detailed, engaging blog article of AT LEAST 1200 words about: "${title}"

Strict writing rules:
- Vary sentence length dramatically. Short punchy ones (4-6 words). Then longer flowing ones that give context, add nuance, and keep the reader moving through the paragraph.
- Open with a real scenario or a surprising statistic — never the keyword itself
- Use personal voice: "Not gonna lie —", "Here's what surprised me:", "My honest take:"
- Include specific real details: company names, version numbers, benchmarks, failure modes
- Use H2 and H3 markdown headings throughout
- Mix prose sections, bullet lists, and numbered steps — not all one format
- FORBIDDEN words: "Furthermore", "Moreover", "In conclusion", "Let's dive in", "Delve into", "Game-changer", "Leverage", "Utilize", "Cutting-edge", "Revolutionary", "In today's world"

Write ONLY the article body in markdown. No title header at the top. No intro like "Here is the article:". Just start writing.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.92,
    max_tokens: 4096,
  });

  return completion.choices[0].message.content || "";
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB\n");

  const blogs = await Blog.find({});
  const shortBlogs = blogs.filter(b => {
    const w = (b.content || "").trim().split(/\s+/).length;
    return w < 700;
  });

  console.log(`Found ${shortBlogs.length} blogs under 700 words\n`);

  for (const blog of shortBlogs) {
    const currentWords = (blog.content || "").trim().split(/\s+/).length;
    const author = blog.author || AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
    console.log(`Writing: "${blog.title}" (currently ${currentWords}w)...`);

    try {
      const newContent = await generateLongArticle(blog.title, author);
      const newWords = newContent.trim().split(/\s+/).length;

      if (newWords < 400) {
        console.log(`  ⚠️  Still short (${newWords}w) — skipping save`);
        continue;
      }

      // Build excerpt from first 2 sentences of content
      const firstPara = newContent.replace(/^#+.+\n+/m, "").trim();
      const sentences = firstPara.match(/[^.!?]+[.!?]+/g) || [];
      const excerpt = sentences.slice(0, 2).join(" ").trim().slice(0, 269);

      await Blog.findByIdAndUpdate(blog._id, {
        content: newContent,
        excerpt: excerpt || firstPara.slice(0, 269),
        readTime: Math.ceil(newWords / 225),
      });

      console.log(`  ✅ ${newWords}w saved\n`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`  ❌ ${err.message}\n`);
    }
  }

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch(console.error);
