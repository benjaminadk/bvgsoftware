import React, { useRef, useEffect, useState } from 'react'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from './high-school-clock/file1'

export default function HighSchoolClock() {
  const slider = useRef()
  const clock = useRef()

  const [size, setSize] = useState(400)

  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      console.log(name)
      if (name === 'clock') {
        return new Inspector(clock.current)
      }
      if (name === 'mutable size') {
        return {
          fulfilled: (value) => {
            slider.current = value
          },
        }
      }
    })
  }, [])

  useEffect(() => {
    if (slider.current) {
      slider.current.value = size
    }
  }, [size])

  return (
    <div>
      <div>
        <div className='font-bold'>Clock Size</div>
        <input
          type='range'
          value={size}
          min={40}
          max={800}
          step={5}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <div className='flex justify-center mt-4'>
        <div ref={clock} />
      </div>
    </div>
  )
}
