import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Li({ children, ...rest }) {
  return (
    <li {...rest}>
      <FontAwesomeIcon icon={['fa', 'caret-right']} />
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

export function Img(props) {
  return (
    <div className='flex justify-center'>
      <img {...props} />
    </div>
  )
}

export function Iframe(props) {
  return (
    <div className='flex justify-center'>
      <iframe {...props} />
    </div>
  )
}
