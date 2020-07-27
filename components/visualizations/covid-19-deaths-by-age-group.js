import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from './covid-19-deaths-by-age-group/file1'

export default function Covid19DeathsByAgeGroup() {
  const chart1 = React.useRef()
  const chart2 = React.useRef()
  const chart3 = React.useRef()

  React.useEffect(() => {
    const runtime = new Runtime()

    runtime.module(notebook, (name) => {
      if (name === 'chart1') {
        return new Inspector(chart1.current)
      }
      if (name === 'chart2') {
        return new Inspector(chart2.current)
      }
      if (name === 'chart3') {
        return new Inspector(chart3.current)
      }
    })
  }, [])

  return (
    <div id='covid-19-deaths-by-age-group'>
      <div ref={chart3} />
      <div ref={chart1} />
      <div ref={chart2} />
    </div>
  )
}
