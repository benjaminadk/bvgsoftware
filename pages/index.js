import Container from '../components/container'
import PostsRecent from '../components/posts-recent'
import Layout from '../components/layout'
import FrontVideo from '../components/front-video'
import FrontServices from '../components/front-services'
import Klaviyo from '../components/klaviyo'

import { getAllPosts } from '../lib/api'

export default function Index({ allPosts }) {
  const recentPosts = allPosts.slice(0, 4)

  return (
    <>
      <Layout>
        <FrontVideo />
        <FrontServices />
        <Klaviyo version='embed' />
        <Container>
          {recentPosts.length > 0 && <PostsRecent posts={recentPosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
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
