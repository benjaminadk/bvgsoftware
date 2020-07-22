import Link from 'next/link'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function PostArchive({ posts }) {
  const [post, setPost] = React.useState(true)
  const [project, setProject] = React.useState(true)
  const [visualization, setVisualization] = React.useState(true)

  return (
    <section id='archive' className='mb-8'>
      <h2 className='mt-20 mb-10 text-6xl md:text-7xl text-center font-bold tracking-tighter leading-tight'>
        Post Archives
      </h2>

      <div className='flex justify-center items-center mb-10 select-none'>
        <div
          className='flex items-center mr-4'
          onClick={() => setPost((cur) => !cur)}
        >
          <FontAwesomeIcon
            className='mr-2 text-lg text-link hover:text-link-hover cursor-pointer'
            icon={['fa', post ? 'check-square' : 'stop']}
          />
          <span className='font-semibold'>Post</span>
        </div>

        <div
          className='flex items-center mr-4'
          onClick={() => setProject((cur) => !cur)}
        >
          <FontAwesomeIcon
            className='mr-2 text-lg text-link hover:text-link-hover cursor-pointer'
            icon={['fa', project ? 'check-square' : 'stop']}
          />
          <span className='font-semibold'>Project</span>
        </div>

        <div
          className='flex items-center mr-4'
          onClick={() => setVisualization((cur) => !cur)}
        >
          <FontAwesomeIcon
            className='mr-2 text-lg text-link hover:text-link-hover cursor-pointer'
            icon={['fa', visualization ? 'check-square' : 'stop']}
          />
          <span className='font-semibold'>Visualization</span>
        </div>
      </div>

      <div className='grid lg:grid-cols-4 gap-8'>
        {posts.map(({ type, title, slug, coverImage }) => (
          <Link key={title} as={`/posts/${slug}`} href='/posts/[slug]'>
            <div
              className={cn(
                'cursor-pointer text-black hover:text-link transition-opacity duration-500',
                {
                  'opacity-25 pointer-events-none':
                    (type === 'post' && !post) ||
                    (type === 'project' && !project) ||
                    (type === 'visualization' && !visualization)
                }
              )}
            >
              <img
                className='shadow-md hover:shadow-lg'
                src={coverImage}
                alt={title}
              />
              <h3 className='text-center font-semibold'>{title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
