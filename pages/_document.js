import Document, { Html, Head, Main, NextScript } from 'next/document'
import cn from 'classnames'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head />
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
