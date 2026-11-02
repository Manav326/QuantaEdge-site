import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const sitemap = baseUrl ? baseUrl.replace(/\/+$/, "") + "/sitemap.xml" : undefined;
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(sitemap ? { sitemap } : {})
  };
}
