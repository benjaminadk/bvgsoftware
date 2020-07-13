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
export const HOME_OG_IMAGE_URL =
  'https://og-image.now.sh/Next.js%20Blog%20Starter%20Example.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg'
