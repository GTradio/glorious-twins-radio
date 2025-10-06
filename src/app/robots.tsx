import siteMetadata from "@/data/siteMetaData";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "*.json",
          "/studio-admin/", // If you have admin areas
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/studio-admin/"],
      },
      // Special rules for media crawlers
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  };
}
