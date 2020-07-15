import Head from 'next/head'

import Container from '../components/container'
import Layout from '../components/layout'
import { SITE } from '../lib/constants'

export default function Contact() {
  return (
    <>
      <Layout>
        <Head>
          <title>Contact Us Today | {SITE.name}</title>
        </Head>
        <Container>
          <h1 className='mt-32'>Under Construction</h1>
        </Container>
      </Layout>
    </>
  )
}
