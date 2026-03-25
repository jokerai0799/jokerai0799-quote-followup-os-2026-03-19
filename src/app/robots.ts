import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/quotes',
        '/chase-list',
        '/settings',
        '/playbook',
        '/login',
        '/signup',
        '/check-email',
        '/verify-email',
        '/r/',
      ],
    },
    sitemap: 'https://quotefollowup.online/sitemap.xml',
    host: 'https://quotefollowup.online',
  }
}
