import Link from 'next/link'

import DateFormater from '../components/date-formater'
import PostCover from './post-cover'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  slug
}) {
  return (
    <div>
      <div className='mb-5'>
        <PostCover context='small' slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className='text-2xl font-bold lg:text-left text-center mb-3 leading-snug'>
        <Link as={`/posts/${slug}`} href='/posts/[slug]'>
          <a className='hover:text-link'>{title}</a>
        </Link>
      </h3>
      <div className='text-lg lg:text-left text-center mb-4'>
        <DateFormater dateString={date} color='pink' />
      </div>
      <p className='text-justify text-lg leading-relaxed mb-4'>{excerpt}</p>
    </div>
  )
}
