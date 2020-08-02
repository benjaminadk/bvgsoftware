import cn from 'classnames'
import Link from 'next/link'

export default function CoverImage({ title, src, slug }) {
  const image = (
    <>
      <img
        src={src}
        alt={`Cover Image for ${title}`}
        className={cn('hidden md:inline-block shadow-small', {
          'hover:shadow-medium transition-shadow duration-200': slug
        })}
      />
      <img
        src={src.replace('cover', 'cover-mobile')}
        alt={`Cover Image for ${title}`}
        className={cn('md:hidden shadow-small', {
          'hover:shadow-medium transition-shadow duration-200': slug
        })}
      />
    </>
  )
  return (
    <div className='-mx-5 sm:mx-0'>
      {slug ? (
        <Link as={`/posts/${slug}`} href='/posts/[slug]'>
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
