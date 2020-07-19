import Head from 'next/head'
import { useRouter } from 'next/router'

import generateSchema from '../lib/generate-schema'
import generateMeta from '../lib/generate-meta'
import { SITE } from '../lib/constants'

export default function Meta() {
  const router = useRouter()

  return (
    <Head>
      {/* Platform Icons */}
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/favicon/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon/favicon-16x16.png'
      />
      <link rel='manifest' href='/favicon/site.webmanifest' />
      <link
        rel='mask-icon'
        href='/favicon/safari-pinned-tab.svg'
        color='#000000'
      />
      <link rel='shortcut icon' href='/favicon/favicon.ico' />
      <meta name='msapplication-TileColor' content='#000000' />
      <meta name='msapplication-config' content='/favicon/browserconfig.xml' />
      <meta name='theme-color' content='#000' />
      <link rel='alternate' type='application/rss+xml' href='/feed.xml' />

      {/* Basic Tags */}

      {!router.pathname.includes('[slug]') && (
        <>
          <title>{generateMeta(router.asPath, 'title')}</title>
          <meta
            property='description'
            content={generateMeta(router.asPath, 'description')}
          />
          <meta
            property='og:title'
            content={generateMeta(router.asPath, 'title')}
          />
          <meta
            property='og:description'
            content={generateMeta(router.asPath, 'description')}
          />
        </>
      )}

      {/* Base Social Media Tags */}
      <meta key='type' property='og:type' content='website' />
      <meta property='og:url' content={`${SITE.url}${router.asPath}`} />
      <meta property='fb:add_id' content='2680429748913061' />

      {/* Base JSON schemas */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema('website', null))
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema('organization', null))
        }}
      />
    </Head>
  )
}
