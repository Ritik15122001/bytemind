import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Full rewrite using 70b model — uses plain text delimiters to avoid JSON corruption
const rewriteWith70b = async (title: string, content: string, author: string) => {
  const wordCount = content.trim().split(/\s+/).length;
  const topicHint = wordCount > 600
    ? `Topic: "${title}". Reference the following existing content but rewrite it completely:\n\n${content.trim().split(/\s+/).slice(0, 120).join(" ")}…`
    : `Topic: "${title}". Write a completely fresh article — existing content is too short to use.`;

  const prompt = `You are ${author}, a real tech writer for ByteMind with 8 years of experience.

Write a 1200-1500 word blog article on this topic.

Writing rules:
- Mix SHORT sentences (3-7 words) with LONG ones (20-35 words). Never 3 similar-length in a row.
- Open with a personal story, scenario, or surprising stat — not the keyword
- Share at least one honest opinion ("My take:", "Not gonna lie —", "Honestly,")
- Include real specifics: company names, version numbers, actual numbers ("reduced latency by 40%")
- Mix prose paragraphs, bullet lists, and numbered steps
- Use H2 and H3 markdown headings
- NEVER write: "Furthermore", "Moreover", "In conclusion", "Let's dive in", "Game-changer", "Leverage", "Utilize"

${topicHint}

Format your response EXACTLY like this — nothing before TITLE, nothing after the article:

TITLE: [your compelling title here]
EXCERPT: [2 hook sentences, max 260 chars]
CONTENT:
[full 1200-1500 word markdown article here]`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.88,
    max_tokens: 5000,
  });

  const raw = completion.choices[0].message.content || "";

  // Case-insensitive extraction — model sometimes writes "Content:" not "CONTENT:"
  const titleMatch = raw.match(/^TITLE:\s*(.+)/im);
  const excerptMatch = raw.match(/^EXCERPT:\s*(.+)/im);
  const contentMatch = raw.match(/^CONTENT:\s*\n([\s\S]+)/im);

  const parsedTitle = titleMatch ? titleMatch[1].trim() : title;
  const parsedExcerpt = excerptMatch ? excerptMatch[1].trim().slice(0, 269) : "";
  // If pattern not found, use the full raw output as content
  const parsedContent = contentMatch ? contentMatch[1].trim() : raw.replace(/^(TITLE|EXCERPT):.+\n?/gim, "").trim();

  const wc = parsedContent.split(/\s+/).length;
  if (wc < 100) {
    throw new Error(`70b too short: ${wc} words`);
  }

  return { title: parsedTitle, content: parsedContent, excerpt: parsedExcerpt };
};

// Safe JSON parse — strips markdown fences, handles partial JSON
const safeParseJSON = (raw: string): Record<string, string> => {
  let cleaned = raw.trim();
  // Strip markdown code fences like ```json ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  // Extract JSON object if embedded in other text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  try {
    return JSON.parse(cleaned);
  } catch {
    // Last resort: extract individual fields with regex
    const getField = (key: string) => {
      const m = cleaned.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";
    };
    return { title: getField("title"), content: getField("content"), excerpt: getField("excerpt") };
  }
};

// Compact generation using 8b model — writes fresh from title only (fits within 6k TPM)
const rewriteWith8b = async (title: string, author: string) => {
  const prompt = `You are ${author}, a tech writer for ByteMind. Write a 1600-word blog post on the topic: "${title}"

Writing rules:
- Mix short sentences (3-7 words) and longer ones (20-35 words). Never 3 similar-length in a row.
- Open with a story, scenario, or surprising stat. NOT the keyword itself.
- Include ONE honest opinion ("My take:", "Honestly,", "Not gonna lie —")
- Use real specifics: company names, version numbers, percentages
- Mix paragraphs, bullet lists, and numbered steps
- BANNED words: "Furthermore", "Moreover", "In conclusion", "Let's dive in", "Game-changer", "Leverage", "Utilize"

Your response must be ONLY a valid JSON object with these exact keys:
{"title": "article title here", "content": "full markdown article here", "excerpt": "2 hook sentences here"}

Do not wrap in code blocks. Return raw JSON only.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 0.9,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });
  const raw = completion.choices[0].message.content || "{}";
  const parsed = safeParseJSON(raw);
  // Ensure excerpt has a fallback
  if (!parsed.excerpt && parsed.content) {
    parsed.excerpt = parsed.content.replace(/#+.+\n/g, "").replace(/\n+/g, " ").trim().slice(0, 260) + "…";
  }
  return parsed;
};

export const humanizeBlogContent = async (
  title: string,
  content: string,
  author: string
): Promise<{ title: string; content: string; excerpt: string }> => {
  // Try 70b first (best quality); fall back to 8b on ANY failure
  try {
    const result = await rewriteWith70b(title, content, author);
    if (result?.content && result.content.split(/\s+/).length >= 100) return result;
    console.log(`  ⚡ 70b returned too-short content, falling back to 8b…`);
  } catch (err) {
    const msg = String(err);
    console.log(`  ⚡ 70b error (${msg.slice(0, 60)}…), falling back to 8b…`);
  }

  // Fallback: 8b model writes fresh from title (compact prompt fits within 6k TPM)
  const result = await rewriteWith8b(title, author);
  if (!result?.content) throw new Error("8b model returned empty content");
  return result as { title: string; content: string; excerpt: string };
};
