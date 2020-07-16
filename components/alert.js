import Container from './container'
import cn from 'classnames'

export default function Alert({ isScrolled }) {
  return (
    <div
      className={cn(
        'fixed z-20 inset-x-0 bg-black border-black text-white border-b transition-all duration-500',
        {
          'top-35m': isScrolled,
          'top-0': !isScrolled
        }
      )}
    >
      <Container>
        <div className='py-2 text-center text-xs font-bold'>
          The BVG Software website is 🚧 UNDER CONSTRUCTION 🚧
        </div>
      </Container>
    </div>
  )
}
