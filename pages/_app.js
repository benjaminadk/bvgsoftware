import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/index.css'

config.autoAddCss = false

library.add(faChevronRight)
library.add(faCaretRight)

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
