import Container from '../components/container'
import PostsRecent from '../components/posts-recent'
import Layout from '../components/layout'
import FrontBanner from '../components/front-banner'
import FrontServices from '../components/front-services'
import FrontKlaviyo from '../components/front-klaviyo'
import FrontContact from '../components/front-contact'

import { getAllPosts } from '../lib/api'

export default function Index({ allPosts }) {
  const recentPosts = allPosts.slice(0, 6)

  return (
    <>
      <Layout>
        <FrontBanner />
        <FrontServices />
        <FrontKlaviyo version='embed' />
        <Container>
          {recentPosts.length > 0 && <PostsRecent posts={recentPosts} />}
        </Container>
        <FrontContact />
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
