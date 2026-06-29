import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface GeneratedBlog {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string[];
}

const CATEGORY_KEYWORD_SEEDS: Record<string, string[]> = {
  "artificial-intelligence": [
    "ChatGPT alternatives 2024", "AI tools for productivity", "future of artificial intelligence",
    "AI in healthcare", "best AI apps", "how AI works explained", "AI replacing jobs",
    "open source AI models", "AI hallucinations explained", "GPT-4 vs Claude vs Gemini",
  ],
  "machine-learning": [
    "machine learning for beginners", "deep learning explained simply", "neural networks tutorial",
    "ML model training tips", "scikit-learn complete guide", "TensorFlow vs PyTorch 2024",
    "supervised vs unsupervised learning", "reinforcement learning examples", "overfitting in machine learning",
  ],
  "programming": [
    "JavaScript tips for developers", "Python beginner guide 2024", "TypeScript best practices",
    "React vs Next.js comparison", "how to learn coding fast", "best programming languages 2024",
    "clean code principles", "git commands every developer should know", "REST API best practices",
    "async await javascript explained",
  ],
  "cybersecurity": [
    "how to stay safe online", "best VPN services 2024", "phishing attacks explained",
    "password manager guide", "two factor authentication guide", "cybersecurity career path",
    "common hacking techniques", "how to protect your data online", "ransomware prevention tips",
  ],
  "gadgets": [
    "best smartphones 2024", "laptop buying guide", "smartwatch comparison 2024",
    "wireless earbuds review", "budget tech deals", "gaming setup essentials",
    "smart home devices worth buying", "best tablets for students", "monitor buying guide",
  ],
  "cloud-devops": [
    "AWS vs Azure vs Google Cloud", "Docker tutorial for beginners", "Kubernetes explained simply",
    "CI/CD pipeline setup guide", "serverless computing guide", "DevOps best practices",
    "cloud cost optimization tips", "microservices architecture explained", "Terraform beginner guide",
  ],
  "tech-news": [
    "biggest tech news this week", "Meta AI latest updates", "Google new features 2024",
    "Apple announcement 2024", "startup funding news", "tech layoffs explained",
    "open source news", "new programming language trends", "tech company earnings explained",
  ],
  "ai-tools": [
    "best AI writing tools", "AI image generators compared", "ChatGPT productivity hacks",
    "Midjourney vs DALL-E 3", "AI coding assistants compared", "free AI tools for students",
    "AI video generators 2024", "best AI for business productivity", "Notion AI vs Copilot",
  ],
};

export const getKeywordForCategory = (categorySlug: string): string => {
  const seeds = CATEGORY_KEYWORD_SEEDS[categorySlug] || ["technology trends 2024"];
  return seeds[Math.floor(Math.random() * seeds.length)];
};

export const generateBlogPost = async (
  categoryName: string,
  categorySlug: string
): Promise<GeneratedBlog> => {
  const focusKeyword = getKeywordForCategory(categorySlug);

  const systemPrompt = `You are a seasoned tech journalist and blogger writing for ByteMind. You have 8+ years hands-on experience in the tech industry.

Your writing rules — follow them exactly:

1. SENTENCE VARIETY (critical — AI detectors flag uniform sentence length):
   Mix very short sentences (3-7 words) with longer ones (25-40 words). Never write three sentences of similar length in a row. Natural rhythm looks like: "It broke. Not catastrophically — just enough to waste an afternoon. I'd been using the same config for two years, and suddenly, on a Tuesday afternoon, it just stopped cooperating the way I expected."

2. OPEN WITH A HOOK — not the keyword:
   Start with a relatable scenario, a surprising stat, or a question. Examples:
   - "Picture this: you've got a deadline in 4 hours and your [tool] just..."
   - "Forty-three percent of [professionals] say they [problem]. That number floored me when I first read it."
   - "Nobody warned me how much time I'd waste on [thing]."

3. PERSONAL VOICE:
   Sprinkle these naturally (not in every paragraph): "here's what I found", "honestly", "worth pausing on", "not gonna lie", "this is where it gets interesting", "took me a while to figure this out", "spoiler:", "(yes, really)"

4. SPECIFIC REAL DETAILS:
   Use real company names, real version numbers, real benchmarks. "dropped from 4.2s to 1.1s", "works on Node 18+ but breaks on 16", "as of Q2 2024". Vague content scores high on AI detectors.

5. STRUCTURE VARIATION:
   Not every section needs bullet points. Mix pure paragraphs, numbered steps, bullets, and short asides. Some sections should be 4-5 sentences, some a single punchy paragraph.

6. OPINIONS AND TAKES:
   Share a real perspective at least twice: "My honest take: X is better for Y, but if you're doing Z, the choice is obvious." or "I know some people swear by [approach], and I understand why — but after [experience], I came around to a different view."

7. BANNED PHRASES — never use these:
   "In today's world", "In today's rapidly evolving", "In conclusion", "It's worth noting",
   "This comprehensive guide", "Let's dive in", "Delve into", "Without further ado",
   "Furthermore", "Moreover", "Additionally" (use "also", "plus", "and", "on top of that"),
   "Leverage", "Utilize" (say "use"), "Game-changer", "Revolutionary", "Cutting-edge",
   "State-of-the-art", "In the realm of", "Shed light on", "It is important to note"

8. LENGTH: 1800–2200 words. Dense, genuinely useful, zero fluff.`;

  const userPrompt = `Write a detailed, human-sounding blog post for the category "${categoryName}" targeting: "${focusKeyword}".

Requirements:
- 1800–2200 words, written as a real expert who has actually used/tested/experienced this
- Open with a story, scenario, or surprising stat (not with the keyword)
- 6–8 main H2 sections, with H3 subsections where natural
- At least one specific real-world example with actual details
- At least two moments where you share your honest opinion
- Mix of prose paragraphs, bullet points, and numbered lists (not all one format)
- Ends with a practical, concrete CTA or takeaway paragraph

Return ONLY valid JSON:
{
  "title": "Natural, curiosity-triggering title (55-70 chars, includes keyword naturally)",
  "excerpt": "2 hook sentences that make someone want to click (150-270 chars)",
  "content": "Full 1800-2200 word markdown article",
  "tags": ["5-8 lowercase tags"],
  "metaTitle": "SEO meta title (50-60 chars)",
  "metaDescription": "SEO meta description (145-155 chars, includes keyword, has a hook)",
  "focusKeyword": "${focusKeyword}",
  "keywords": ["10-12 LSI and related keywords"]
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.92,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content || "{}";
  return JSON.parse(raw) as GeneratedBlog;
};
