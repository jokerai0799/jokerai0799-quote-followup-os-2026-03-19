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
  {
    slug: 'plumber-quote-follow-up-software',
    label: 'Plumber quote follow-up software',
  },
  {
    slug: 'electrician-quote-follow-up-software',
    label: 'Electrician quote follow-up software',
  },
  {
    slug: 'cleaning-quote-follow-up-software',
    label: 'Cleaning quote follow-up software',
  },
  {
    slug: 'quote-chasing-software',
    label: 'Quote chasing software',
  },
  {
    slug: 'following-up-on-quotes',
    label: 'Following up on quotes',
  },
] as const

export const seoPageLinks = seoPages.map((page) => ({
  href: `/${page.slug}`,
  label: page.label,
}))
