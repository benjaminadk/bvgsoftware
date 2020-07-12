import Head from 'next/head'

import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Layout from '../components/layout'
import LandingVideo from '../components/landing-video'
import Klaviyo from '../components/klaviyo'
import { getAllPosts } from '../lib/api'
import { SITE_NAME } from '../lib/constants'

export default function Index({ allPosts }) {
  const recentPosts = allPosts.slice(0, 4)

  return (
    <>
      <Layout>
        <Head>
          <title>{SITE_NAME} | Home</title>
        </Head>
        <LandingVideo />
        <Klaviyo version='embed' />
        <Container>
          {recentPosts.length > 0 && <MoreStories posts={recentPosts} />}
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
