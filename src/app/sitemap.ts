import type { MetadataRoute } from 'next'
import { seoPages } from '@/lib/seo-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quotefollowup.online'
  const lastModified = new Date()

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...seoPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
