import { SITE } from './constants'

export function website() {
  return {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    sameAs: ['', '', ''],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'http://example.com/pages/search_results?q={search_term}',
      'query-input': 'required name=search_term'
    }
  }
}

export function blogPosting(post) {
  const postUrl = `${SITE.url}/posts/${post.slug}`

  return {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    image: post.coverImage,
    url: postUrl,
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
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
        url: post.author.picture,
        width: '458',
        height: '458'
      }
    }
  }
}
