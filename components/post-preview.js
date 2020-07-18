import DateFormater from '../components/date-formater'
import CoverImage from './cover-image'
import Link from 'next/link'

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
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className='text-2xl font-bold mb-3 leading-snug'>
        <Link as={`/posts/${slug}`} href='/posts/[slug]'>
          <a className='hover:text-red-700'>{title}</a>
        </Link>
      </h3>
      <div className='text-lg mb-4'>
        <DateFormater dateString={date} />
      </div>
      <p className='text-justify text-lg leading-relaxed mb-4'>{excerpt}</p>
    </div>
  )
}
