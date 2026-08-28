import type { MetadataRoute } from "next"

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.escapetourstz.com"

  // Static pages
  const staticPages = ["", "/about", "/contact", "/packages", "/hotels", "/gallery"]

  const packageSlugs = [
    "east-african-residents",
    "zanzibar-beach-escape",
    "southern-tanzania-safari",
    "northern-tanzania-safari",
    "safari-zanzibar-combo",
    "ruaha-zanzibar-combo",
    "kilimanjaro-marangu",
    "kilimanjaro-machame",
    "northern-circuit-safari",
  ]

  // Hotel pages - add all your hotel slugs
  const hotelSlugs = [
    "tulia-zanzibar-unique-beach-resort",
    "merera-village-lodge",
    "lake-manyara-kilimamoja-lodge",
    "ole-serai-moru-kopjes",
    "ole-serai-turner-springs",
    "melia-serengeti-lodge",
    "tarangire-sopa-lodge",
    "lake-manyara-serena-safari-lodge",
    "ngorongoro-serena-safari-lodge",
    "serengeti-serena-safari-lodge",
  ]

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page === "" ? 1.0 : 0.8,
  }))

  const hotelUrls = hotelSlugs.map((slug) => ({
    url: `${baseUrl}/hotels/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const packageUrls = packageSlugs.map((slug) => ({
    url: `${baseUrl}/packages/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticUrls, ...packageUrls, ...hotelUrls]
}
