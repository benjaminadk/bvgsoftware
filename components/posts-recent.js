import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PostPreview from './post-preview'

export default function MoreStories({ posts, subtitle = 'Recent Blog Posts' }) {
  return (
    <section>
      <h2 className='lg:mt-20 mt-10 lg:mb-16 mb-8 lg:text-8xl text-7xl text-center font-bold tracking-tighter leading-tight'>
        {subtitle}
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 md:col-gap-16 lg:col-gap-20 row-gap-20 md:row-gap-20 mb-16'>
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>

      {subtitle === 'Recent Blog Posts' && (
        <h3 className='lg:mt-20 mt-10 lg:mb-16 mb-8 lg:text-7xl text-6xl text-center font-bold tracking-tighter leading-tight'>
          <Link href='/posts'>
            <a className='hover:text-link'>
              <span>Discover More Blog Posts</span>

              <FontAwesomeIcon
                className='ml-8'
                icon={['fa', 'external-link-alt']}
              />
            </a>
          </Link>
        </h3>
      )}
    </section>
  )
}
