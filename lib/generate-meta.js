import { PAGES } from './constants'

export default function generateMeta(asPath, property) {
  return PAGES[asPath][property]
}
