import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ranamasudbd.com";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/detail/", "/ctg/", "/*?items*", "/*?ctg*", "/*?*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

