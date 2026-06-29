import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bytemind.vercel.app";
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || "http://localhost:5001/api";

const CATEGORIES = [
  "artificial-intelligence", "machine-learning", "programming",
  "cybersecurity", "gadgets", "cloud-devops", "tech-news", "ai-tools",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL,              lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/blog`,   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/about`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...CATEGORIES.map((slug) => ({
      url:             `${SITE_URL}/category/${slug}`,
      lastModified:    new Date(),
      changeFrequency: "daily" as const,
      priority:        0.8,
    })),
  ];

  try {
    const res  = await fetch(`${API_URL}/blogs?limit=500`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const blogRoutes: MetadataRoute.Sitemap = (data.data || []).map((b: { slug: string; publishedAt: string }) => ({
      url:             `${SITE_URL}/blog/${b.slug}`,
      lastModified:    new Date(b.publishedAt),
      changeFrequency: "weekly" as const,
      priority:        0.7,
    }));
    return [...base, ...blogRoutes];
  } catch {
    return base;
  }
}
