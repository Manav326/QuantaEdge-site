import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) return [];
  const origin = baseUrl.replace(/\\/$/, "");
  return [
    { url: origin, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/privacy`, changeFrequency: "yearly", priority: 0.25 },
  ];
}
