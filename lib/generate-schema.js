import { SITE } from './constants'

export default function generateSchema(type, data) {
  if (type === 'website') {
    return {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
      sameAs: ['https://www.facebook.com/bvgsoftware']
    }
  } else if (type === 'organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      legalName: SITE.name,
      url: SITE.url,
      logo: SITE.logo,
      foundingDate: '2015',
      founders: [
        {
          '@type': 'Person',
          name: 'Benjamin Brooke'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3240 S Kerckhoff Ave',
        addressLocality: 'San Pedro',
        addressRegion: 'CA',
        postalCode: '90731',
        addressCountry: 'USA'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '[+518-791-4620]',
        email: 'sales@bvgsoftware.com'
      },
      sameAs: ['https://www.facebook.com/bvgsoftware']
    }
  } else if (type === 'blog') {
    const postUrl = `${SITE.url}/posts/${data.slug}`

    return {
      '@context': 'http://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl
      },
      image: data.coverImage,
      url: postUrl,
      headline: data.title,
      datePublished: data.date,
      dateModified: data.date,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: SITE.author
      },
      publisher: {
        '@type': 'Organization',
        name: SITE.name,
        url: SITE.url,
        logo: {
          '@type': 'ImageObject',
          url: data.author.picture,
          width: '458',
          height: '458'
        }
      }
    }
  } else if (type === 'video') {
    const { description, duration, contentUrl } = data.video
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data.title,
      description,
      thumbnailUrl:
        'https://i9.ytimg.com/vi/T9h33vBqSKs/mq1.jpg?sqp=CNCDxvEF&rs=AOn4CLBmW8FAGj91H_xKOLTb8-1EGL-ZMA',
      uploadDate: data.date,
      duration,
      contentUrl
    }
  }
}
