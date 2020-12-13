import DateFormater from '../components/date-formater'
import PostCover from '../components/post-cover'
import Link from 'next/link'

export default function HeroPost({ title, coverImage, date, excerpt, slug }) {
  return (
    <section>
      <div className='mb-8'>
        <PostCover context='hero' title={title} src={coverImage} slug={slug} />
      </div>
      <div className='mb-20 md:mb-28'>
        <div>
          <h3 className='mb-4 text-4xl lg:text-6xl font-bold leading-tight'>
            <Link as={`/posts/${slug}`} href='/posts/[slug]'>
              <a className='hover:text-link'>{title}</a>
            </Link>
          </h3>
          <div className='mb-4 text-lg'>
            <DateFormater dateString={date} color='pink' />
          </div>
        </div>
        <div>
          <p className='text-lg text-justify leading-relaxed mb-4'>{excerpt}</p>
        </div>
      </div>
    </section>
  )
}
