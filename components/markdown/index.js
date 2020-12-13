import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SRLWrapper } from 'simple-react-lightbox'
import cn from 'classnames'
import copy from 'clipboard-copy'

export function Li({ children, ...rest }) {
  return (
    <li {...rest}>
      <FontAwesomeIcon
        className='mr-2 text-link'
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

export function Img({ alt, ...rest }) {
  return (
    <SRLWrapper>
      <div className='flex flex-col items-center my-8 cursor-zoom-in'>
        <img className='shadow-md' {...rest} alt={alt} />
        {alt && <span className='text-gray-700 text-sm mt-1'>{alt}</span>}
      </div>
    </SRLWrapper>
  )
}

export function Iframe(props) {
  return (
    <div className='flex justify-center'>
      <iframe className='shadow-md' {...props} />
    </div>
  )
}

export function Pre(props) {
  const code = React.useRef()

  const [copied, setCopied] = useState(false)

  function onClick() {
    copy(code.current.textContent)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

  return (
    <pre ref={code} className={cn(`${props.className} relative`)}>
      {props.children}
      <span
        onClick={onClick}
        className='absolute right-0 top-0 text-xs bg-copy text-black px-2 py-1 transition-colors duration-200 cursor-pointer'
      >
        <FontAwesomeIcon icon={['fa', copied ? 'check' : 'copy']} />
      </span>
    </pre>
  )
}

export function Blockquote(props) {
  return (
    <blockquote className='border-l-8 border-link bg-inline-code py-2 mx-0 md:mx-6'>
      <span className='block px-4 italic'>
        {props.children[1].props.children}
      </span>
    </blockquote>
  )
}
