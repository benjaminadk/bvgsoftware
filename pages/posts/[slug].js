import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import PostTitle from '../../components/post-title'

import { getPostBySlug, getAllPosts } from '../../lib/api'
import generateSchema from '../../lib/generate-schema'
import { SITE } from '../../lib/constants'

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className='mb-32'>
              <Head>
                <title>
                  {post.title} | {SITE.name}
                </title>
                <meta
                  key={post.slug}
                  property='description'
                  content={post.excerpt}
                />

                <meta key={post.slug} property='og:type' content='article' />
                <meta
                  key={post.slug}
                  property='og:description'
                  content={post.excerpt}
                />

                <meta
                  key={post.slug}
                  property='og:image'
                  content={post.coverImage}
                />
                <script
                  key={post.slug}
                  type='application/ld+json'
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateSchema('blog', post))
                  }}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody post={post} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'type',
    'title',
    'date',
    'slug',
    'author',
    'content',
    'coverImage'
  ])

  return {
    props: {
      post
    }
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug
        }
      }
    }),
    fallback: false
  }
}
