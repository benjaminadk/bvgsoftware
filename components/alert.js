import Container from './container'
import cn from 'classnames'

export default function Alert({ preview }) {
  return (
    <div
      className={cn('fixed inset-x-0 top-0 border-b z-20', {
        'bg-black border-black text-white': preview,
        'bg-primary-0 border-primary-3': !preview
      })}
    >
      <Container>
        <div className='py-2 text-center text-xs font-bold'>
          {preview ? (
            <>
              This is page is a preview.{' '}
              <a
                href='/api/exit-preview'
                className='underline duration-200 transition-colors'
              >
                Click here
              </a>{' '}
              to exit preview mode.
            </>
          ) : (
            <>The BVG Software website is 🚧 UNDER CONSTRUCTION 🚧</>
          )}
        </div>
      </Container>
    </div>
  )
}
