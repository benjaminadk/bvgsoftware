import Head from 'next/head'

import Container from '../components/container'
import Layout from '../components/layout'
import { SITE_NAME } from '../lib/constants'

export default function Contact() {
  return (
    <>
      <Layout>
        <Head>
          <title>Contact | {SITE_NAME}</title>
        </Head>
        <Container>
          <h1 className='mt-32'>Under Construction</h1>
        </Container>
      </Layout>
    </>
  )
}
