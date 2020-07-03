import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/index.css'

config.autoAddCss = false

library.add(faChevronRight)

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
