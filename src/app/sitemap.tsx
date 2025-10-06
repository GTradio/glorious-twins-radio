import siteMetadata from "@/data/siteMetaData";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.siteUrl;
  const currentDate = new Date().toISOString();

  return [
    // Main pages
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
