import PostPreview from './post-preview'

export default function MoreStories({ posts, subtitle = 'Recent Blog Posts' }) {
  return (
    <section>
      <h2 className='my-20 text-6xl md:text-7xl text-center font-bold tracking-tighter leading-tight'>
        {subtitle}
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 md:col-gap-16 lg:col-gap-20 row-gap-20 md:row-gap-20 mb-32'>
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
    </section>
  )
}