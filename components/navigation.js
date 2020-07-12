import Link from 'next/link'
import cn from 'classnames'
import { NAV_ITEMS } from '../lib/constants'

export default function Navigation() {
  const [showMenu, setShowMenu] = React.useState(false)

  return (
    <nav className='fixed inset-x-0 top-0 z-10 flex items-center justify-between flex-wrap bg-white p-6'>
      <Link href='/'>
        <div className='flex items-center flex-shrink-0 text-black cursor-pointer mr-6'>
          <svg
            className='fill-current h-8 w-8 mr-2'
            width='54'
            height='54'
            viewBox='0 0 54 54'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z' />
          </svg>
          <span className='font-semibold text-xl tracking-tight'>
            BVG Software
          </span>
        </div>
      </Link>
      <div className='block lg:hidden'>
        <button
          onClick={() => setShowMenu((cur) => !cur)}
          className='flex items-center px-3 py-2 border rounded text-black border-black hover:text-blue-500 hover:border-blue-500'
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
        className={cn('w-full flex-grow lg:flex lg:items-center lg:w-auto', {
          hidden: !showMenu
        })}
      >
        <div className='text-sm lg:flex-grow'>
          {NAV_ITEMS.map((link) => (
            <Link key={link.slug} href={link.slug}>
              <a className='block mt-4 lg:inline-block lg:mt-0 text-black mr-4'>
                {link.text}
              </a>
            </Link>
          ))}
        </div>
        <div>
          <a
            href='#'
            className='inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black mt-4 lg:mt-0'
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  )
}
