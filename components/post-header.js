import Avatar from '../components/avatar'
import DateFormater from '../components/date-formater'
import CoverImage from '../components/cover-image'
import PostTitle from '../components/post-title'

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
  readTime
}) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className='mb-8 md:mb-16 -mx-5 sm:mx-0'>
        <CoverImage title={title} src={coverImage} />
      </div>
      <div className='max-w-2xl flex items-center mx-auto'>
        <div className='flex items-center mb-6 text-lg font-semibold'>
          <img
            src={author.picture}
            className='w-8 h-8 rounded-full mr-4'
            alt={author.name}
          />
          <DateFormater dateString={date} />
          <div className='mx-2'> &bull; </div>
          <span className='text-link font-bold'>{readTime} Min Read</span>
        </div>
      </div>
    </>
  )
}
