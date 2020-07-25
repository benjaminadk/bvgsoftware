import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from './simple-binary-search-tree/file1'

export default function SimpleBinarySearchTree() {
  const reset1 = React.useRef()
  const searchFor1 = React.useRef()
  const linear1 = React.useRef()
  const binary1 = React.useRef()
  const tree1 = React.useRef()
  const reset2 = React.useRef()
  const searchFor2 = React.useRef()
  const linear2 = React.useRef()
  const binary2 = React.useRef()
  const tree2 = React.useRef()

  React.useEffect(() => {
    const runtime = new Runtime()

    runtime.module(notebook, (name) => {
      if (name === 'viewof reset1') {
        return new Inspector(reset1.current)
      }
      if (name === 'viewof searchFor1') {
        return new Inspector(searchFor1.current)
      }
      if (name === 'linear1') {
        return new Inspector(linear1.current)
      }
      if (name === 'binary1') {
        return new Inspector(binary1.current)
      }
      if (name === 'tree1') {
        return new Inspector(tree1.current)
      }
      if (name === 'viewof reset2') {
        return new Inspector(reset2.current)
      }
      if (name === 'viewof searchFor2') {
        return new Inspector(searchFor2.current)
      }
      if (name === 'linear2') {
        return new Inspector(linear2.current)
      }
      if (name === 'binary2') {
        return new Inspector(binary2.current)
      }
      if (name === 'tree2') {
        return new Inspector(tree2.current)
      }
    })
  }, [])

  return (
    <div id='simple-binary-search-tree'>
      <h2 className='text-3xl font-semibold mb-4'>Search of 100 Items</h2>
      <div ref={reset1} className='mb-4' />
      <div ref={searchFor1} className='mb-4' />
      <div ref={linear1} />
      <div ref={binary1} className='mb-4' />
      <div ref={tree1} className='visualization' />
      <h2 className='text-3xl font-semibold my-4'>Search of 10000 Items</h2>
      <div ref={reset2} className='mb-4' />
      <div ref={searchFor2} className='mb-4' />
      <div ref={linear2} />
      <div ref={binary2} className='mb-4' />
      <div ref={tree2} className='visualization' />
    </div>
  )
}
