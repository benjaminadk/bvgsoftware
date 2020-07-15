import Head from 'next/head'

import Container from '../components/container'
import Layout from '../components/layout'
import { SITE } from '../lib/constants'

export default function Development() {
  return (
    <>
      <Layout>
        <Head>
          <title>Technology Services | {SITE.name}</title>
        </Head>
        <Container>
          <h1 className='mt-32'>Under Construction</h1>
        </Container>
      </Layout>
    </>
  )
}
