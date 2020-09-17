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

export default function Post({ post, morePosts }) {
  const router = useRouter()
  if (!router.isFallback && !post.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className='mb-32'>
              <Head>
                <title key='title'>
                  {post.title} | {SITE.name}
                </title>
                <meta property='description' content={post.excerpt} />
                <meta key='type' property='og:type' content='article' />
                <meta property='og:title' content={post.title} />
                <meta property='og:description' content={post.excerpt} />
                <meta
                  property='og:image'
                  content={SITE.url + post.coverImage}
                />
                <meta property='og:image:type' content='image/jpeg' />
                <meta property='og:image:width' content='2000' />
                <meta property='og:image:height' content='1000' />
                <script
                  key='blog-schema'
                  type='application/ld+json'
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateSchema('blog', post))
                  }}
                />
                {post.video && (
                  <script
                    key='video-schema'
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify(generateSchema('video', post))
                    }}
                  />
                )}
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                readTime={post.readTime}
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
    'excerpt',
    'content',
    'coverImage',
    'video',
    'readTime'
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
