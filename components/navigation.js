import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Container from './container'
import { SOCIAL_MEDIA, NAV_ITEMS } from '../lib/constants'

export default function Navigation({ isScrolled }) {
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav
      className={cn(
        'fixed inset-x-0 z-10 bg-white p-6 transition-all duration-500',
        {
          'top-0 shadow-md': isScrolled,
          'top-35': !isScrolled,
        }
      )}
    >
      <Container classNames='flex items-center justify-between flex-wrap'>
        <Link href='/'>
          <div className='flex items-center flex-shrink-0 text-black cursor-pointer mr-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 500 500'
              className='fill-current h-8 w-8 mr-2'
            >
              <circle
                cx='248.2'
                cy='245.9'
                r='220.9'
                fill='#fff'
                stroke='#000'
                strokeWidth='15'
              />
              <path
                d='M212.5 352.9l-.3-92.6-62.8.2 104.5-138.8 105.4 138.1-62.8.2.3 92.6-84.3.3z'
                stroke='#000'
              />
            </svg>

            <span className='font-bold text-xl tracking-tight'></span>
          </div>
        </Link>
        <div className='block lg:hidden'>
          <button
            onClick={() => setShowMenu((cur) => !cur)}
            className='flex items-center px-3 py-2 border rounded text-black border-black'
          >
            <svg
              className='fill-current h-3 w-3'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <title>Menu</title>
              <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
            </svg>
          </button>
        </div>
        <div
          className={cn('w-full flex-grow lg:w-auto lg:flex lg:items-center', {
            hidden: !showMenu,
          })}
        >
          <ul className='text-xl flex flex-col text-center items-center mb-4 lg:text-base lg:flex-grow lg:flex-row lg:text-left lg:mb-0'>
            {NAV_ITEMS.map((link) => (
              <li
                key={link.slug}
                className={cn(
                  'block mt-4 text-black hover:text-link font-bold mr-4 cursor-pointer duration-200 transition-colors lg:inline-block lg:mt-0 lg:pr-4',
                  {
                    'text-link': router.pathname.includes(`/${link.slug}`),
                    'text-black': !router.pathname.includes(`/${link.slug}`),
                  }
                )}
                onClick={() => router.push(`/${link.slug}`)}
              >
                {link.text}
              </li>
            ))}
          </ul>
          <ul className='flex items-center justify-center lg:justify-end'>
            {SOCIAL_MEDIA.map((el) => (
              <li key={el.name} className='mr-6 text-xl hover:text-link'>
                <a href={el.url} target='_blank'>
                  <FontAwesomeIcon icon={el.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </nav>
  )
}
