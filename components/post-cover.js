import Link from 'next/link'
import Image from 'next/image'
import cn from 'classnames'

export default function PostCover({ context, title, src, slug }) {
  const image = (
    <>
      <div
        className={cn('hidden md:flex shadow-small', {
          'hover:shadow-medium transition-shadow duration-200': slug,
        })}
      >
        <Image src={src} alt={title} width={2000} height={1000} />
      </div>
      <div
        className={cn('flex md:hidden shadow-small', {
          'hover:shadow-medium transition-shadow duration-200': slug,
        })}
      >
        <Image
          src={src.replace('cover', 'cover-mobile')}
          alt={title}
          width={1000}
          height={1000}
        />
      </div>
    </>
  )
  return (
    <div className='mx-5 sm:mx-0'>
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
