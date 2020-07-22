import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare'
import { faStop } from '@fortawesome/free-solid-svg-icons/faStop'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/index.css'

config.autoAddCss = false

library.add(faCopy)
library.add(faCaretRight)
library.add(faCheck)
library.add(faCheckSquare)
library.add(faStop)

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
