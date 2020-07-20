import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Li({ children, ...rest }) {
  return (
    <li {...rest}>
      <FontAwesomeIcon
        className='mr-2 text-red-700'
        icon={['fa', 'caret-right']}
      />
      {children}
    </li>
  )
}

export function Span({ children, ...rest }) {
  if (children[0] === '// highlight-line') {
    return <span {...rest} className='highlight' />
  } else {
    return <span {...rest}>{children}</span>
  }
}

export function Img({ caption, ...rest }) {
  return (
    <div className='flex flex-col items-center my-8'>
      <img className='shadow-md' {...rest} />
      {caption && <span className='text-gray-700 text-sm mt-1'>{caption}</span>}
    </div>
  )
}

export function Iframe(props) {
  return (
    <div className='flex justify-center'>
      <iframe className='shadow-md' {...props} />
    </div>
  )
}
