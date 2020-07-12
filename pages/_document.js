import Document, { Html, Head, Main, NextScript } from 'next/document'
import cn from 'classnames'

import { GA_TRACKING_ID } from '../lib/constants'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
            }}
          />
          {/* Klaviyo */}
          <script
            type='text/javascript'
            async
            src='https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=PpS4mB'
          />
        </Head>
        <body
          className={cn({
            'debug-screens': process.env.NODE_ENV === 'development'
          })}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
