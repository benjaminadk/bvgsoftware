import Layout from '../../components/layout'
import Container from '../../components/container'
import PostsRecent from '../../components/posts-recent'
import PostsArchive from '../../components/posts-archive'
import HeroPost from '../../components/hero-post'
import Intro from '../../components/intro'

import { getAllPosts } from '../../lib/api'

export default function Index({ allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1, 5)
  const restOfPosts = allPosts.slice()

  return (
    <>
      <Layout>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && (
            <PostsRecent posts={morePosts} subtitle='Recent Posts' />
          )}
          {restOfPosts.length > 0 && <PostsArchive posts={restOfPosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'type',
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt'
  ])

  return {
    props: { allPosts }
  }
}
