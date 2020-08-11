import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from './covid-19-pandemic-timelapse-choropleth/file1'

export default function Covid19PandemicTimelapseChoropleth() {
  const currentDate = React.useRef()
  const totalCases = React.useRef()
  const button1 = React.useRef()
  const button2 = React.useRef()
  const chart = React.useRef()
  const loop = React.useRef()

  React.useEffect(() => {
    const runtime = new Runtime()

    runtime.module(notebook, (name) => {
      if (name === 'currentDate') {
        return new Inspector(currentDate.current)
      }
      if (name === 'totalCases') {
        return new Inspector(totalCases.current)
      }
      if (name === 'viewof button1') {
        return new Inspector(button1.current)
      }
      if (name === 'viewof button2') {
        return new Inspector(button2.current)
      }
      if (name === 'chart') {
        return new Inspector(chart.current)
      }
      if (name === 'loop') {
        return new Inspector(loop.current)
      }
    })
  }, [])

  return (
    <div id='covid-19-pandemic-timelapse-choropleth' className='mb-20'>
      <div ref={currentDate} className='font-bold' />
      <div ref={totalCases} className='font-bold mb-4' />
      <div className='flex mb-4'>
        <div ref={button1} className='mr-4' />
        <div ref={button2} />
      </div>
      <div ref={chart} />
      <div ref={loop} className='hidden' />
    </div>
  )
}
