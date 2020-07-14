export const SITE_NAME = 'BVG Software'

export const SITE = {
  name: 'BVG Software',
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://bvgsoftware.com',
  logo: '/assets/blog/authors/bvg.jpg',
  author: 'Benjamin Brooke'
}

export const NAV_ITEMS = [
  { slug: 'development', text: 'Development' },
  { slug: 'posts', text: 'Blog' },
  { slug: 'contact', text: 'Contact' }
]

export const GA_TRACKING_ID = 'UA-143670697-9'

export const EXAMPLE_PATH = 'blog-starter'
export const CMS_NAME = 'Markdown'
