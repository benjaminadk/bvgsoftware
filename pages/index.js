import Head from 'next/head'

import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Layout from '../components/layout'
import TopBar from '../components/topbar'
import BvgVideo from '../components/bvg-video'
import Klaviyo from '../components/klaviyo'
import { getAllPosts } from '../lib/api'
import { SITE_NAME } from '../lib/constants'

function Cards() {
  return (
    <div className='grid grid-cols-3 my-20'>
      <div className='flex justify-center'>
        <img
          className='w-6/12'
          src='/assets/front/programmer.jpg'
          alt='Programmer'
        />
      </div>
      <div className='flex justify-center'>
        <img
          className='w-6/12'
          src='/assets/front/programmer.jpg'
          alt='Programmer'
        />
      </div>
      <div className='flex justify-center'>
        <img
          className='w-6/12'
          src='/assets/front/programmer.jpg'
          alt='Programmer'
        />
      </div>
    </div>
  )
}

export default function Index({ allPosts }) {
  const recentPosts = allPosts.slice(0, 4)

  return (
    <>
      <Layout>
        <Head>
          <title>{SITE_NAME} | Home</title>
        </Head>
        <TopBar />
        <BvgVideo />
        <Klaviyo version='embed' />
        <Cards />
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
