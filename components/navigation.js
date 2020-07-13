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

          <span className='font-bold text-xl tracking-tight'>BVG Software</span>
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
        className={cn('w-full flex-grow lg:flex lg:items-center lg:w-auto', {
          hidden: !showMenu
        })}
      >
        <div className='text-sm lg:flex-grow'>
          {NAV_ITEMS.map((link) => (
            <Link key={link.slug} href={link.slug}>
              <a className='block mt-4 lg:inline-block lg:mt-0 text-black font-bold mr-4'>
                {link.text}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
