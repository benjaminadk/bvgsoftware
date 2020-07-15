export const SITE = {
  name: 'BVG Software',
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://bvgsoftware.com',
  logo: '/assets/blog/authors/bvg.jpg',
  author: 'Benjamin Brooke'
}

export const SOCIAL_MEDIA = [
  { url: '', name: '', icon: '' },
  { url: '', name: '', icon: '' },
  { url: '', name: '', icon: '' }
]

export const NAV_ITEMS = [
  { slug: 'services', text: 'Services' },
  { slug: 'posts', text: 'Blog' },
  { slug: 'contact', text: 'Contact' }
]

export const SERVICES = [
  {
    title: 'Mobile Applications',
    text:
      'Harness the latest mobile capabilities in a stand-alone Android or iOS application. Alternatively, utilize responsive, mobile first design to leverage your website across all devices.',
    src: 'mobile.png'
  },
  {
    title: 'Website Development',
    text:
      'Creative solutions, designed to deliver a great user experience at lighting fast speed. Lets us help you meet the economic, logistic, and security needs of your modern business.',
    src: 'development.png'
  },
  {
    title: 'Domain & Deployment',
    text:
      'Let us help you purchase a domain, configure DNS settings, and manage hosting and deployment. Find out how to save both upfront and monthly costs by consulting a technology expert.',
    src: 'deployment.png'
  }
]

export const GA_TRACKING_ID = 'UA-143670697-9'
