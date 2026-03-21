export const seoPages = [
  {
    slug: 'quote-follow-up-software',
    label: 'Quote follow-up software',
  },
  {
    slug: 'estimate-follow-up-software',
    label: 'Estimate follow-up software',
  },
  {
    slug: 'quote-management-software-for-trades',
    label: 'Quote management software for trades',
  },
] as const

export const seoPageLinks = seoPages.map((page) => ({
  href: `/${page.slug}`,
  label: page.label,
}))
