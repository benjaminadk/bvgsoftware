import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from './minesweeper/file1'

export default function Minesweeper() {
  const level = React.useRef()
  const minesweeper = React.useRef()
  const pattern = React.useRef()
  const style = React.useRef()

  React.useEffect(() => {
    const runtime = new Runtime()

    runtime.module(notebook, (name) => {
      if (name === 'viewof level') {
        return new Inspector(level.current)
      }
      if (name === 'minesweeper') {
        return new Inspector(minesweeper.current)
      }
      if (name === 'style') {
        return new Inspector(style.current)
      }
      if (name === 'pattern') {
        return new Inspector(pattern.current)
      }
    })
  }, [])

  return (
    <div>
      <div ref={level} className='mt-4 mb-2 mx-auto' />
      <div className='flex items-center justify-center'>
        <div ref={minesweeper} />
      </div>
      <div ref={pattern} />
      <div ref={style} />
    </div>
  )
}
