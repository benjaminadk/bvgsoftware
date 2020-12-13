import React, { useState } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import Alert from '../components/alert'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useScrollPosition(
    ({ prevPos, currPos }) => {
      if (Math.abs(currPos.y) > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    },
    [isScrolled]
  )

  return (
    <>
      <Meta />
      <div className='min-h-screen'>
        <Alert isScrolled={isScrolled} />
        <Navigation isScrolled={isScrolled} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
