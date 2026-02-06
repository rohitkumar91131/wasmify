import { navItems } from "@/data/navItems";

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '').replace(/-+$/, '');
};

export default function sitemap() {
  const baseUrl = "https://wasmify.rohits.online";

  const staticRoutes = ["", "/video", "/image", "/audio", "/pdf", "/subtitles", "/metadata"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  const dynamicRoutes = navItems.flatMap((category) => {
    return category.features.map((feature) => ({
      url: `${baseUrl}${category.path}/${slugify(feature)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  });

  return [...staticRoutes, ...dynamicRoutes];
}