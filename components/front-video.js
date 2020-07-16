export default function FrontVideo({ skip }) {
  const video = React.useRef()
  const canvas = React.useRef()

  // React.useEffect(() => {
  //   try {
  //     video.current.play()
  //   } catch (error) {
  //     if (error) {
  //       console.log(error)
  //     }
  //   }
  // }, [])

  React.useEffect(() => {
    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
    const ctx = canvas.current.getContext('2d')
    const config = {
      particleNumber: 400,
      maxParticleSize: 10,
      maxSpeed: 50,
      colorVariation: 50
    }
    const colorPalette = {
      bg: { r: 0, g: 0, b: 0 },
      matter: [
        { r: 36, g: 18, b: 42 },
        { r: 78, g: 36, b: 42 },
        { r: 252, g: 178, b: 96 },
        { r: 255, g: 255, b: 255 }
      ]
    }
    var particles = []

    class Particle {
      constructor(x, y) {
        this.x = x || Math.round(Math.random() * canvas.current.width)
        this.y = y || Math.round(Math.random() * canvas.current.height)
        this.r = Math.ceil(Math.random() * config.maxParticleSize)
        this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), 0.7)
        this.d = Math.round(Math.random() * 360)
        this.c = colorVariation(
          colorPalette.matter[
            Math.floor(Math.random() * colorPalette.matter.length)
          ],
          true
        )
      }
    }

    function drawBg(ctx, color) {
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height)
    }

    function colorVariation(color, returnString) {
      const r = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.r
      )
      const g = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.g
      )
      const b = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.b
      )
      const a = Math.random() + 0.5
      if (returnString) {
        return `rgba(${r}, ${g}, ${b}, ${a})`
      } else {
        return { r, g, b, a }
      }
    }

    function updateParticleModel(p) {
      let a = 180 - p.d + 90
      let diff1 = (p.s * Math.sin(p.d)) / Math.sin(p.s)
      let diff2 = (p.s * Math.sin(a)) / Math.sin(p.s)

      if (p.d > 0 && p.d < 180) {
        p.x += diff1
      } else {
        p.x -= diff1
      }

      if (p.d > 90 && p.d < 270) {
        p.y += diff2
      } else {
        p.y -= diff2
      }

      return p
    }

    function drawParticle(x, y, r, c) {
      ctx.beginPath()
      ctx.fillStyle = c
      ctx.arc(x, y, r, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.closePath()
    }

    function cleanUpArray() {
      particles = particles.filter((p) => p.x > -100 && p.y > -100)
    }

    function initParticles(numParticles, x, y) {
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y))
      }
      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c)
      })
    }

    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60)
        }
      )
    })()

    function frame() {
      drawBg(ctx, colorPalette.bg)

      particles.map(updateParticleModel)

      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c)
      })

      window.requestAnimFrame(frame)
    }

    document.getElementById('canvas-wrapper').addEventListener('click', (e) => {
      cleanUpArray()
      initParticles(config.particleNumber, e.clientX, e.clientY)
    })

    frame()

    initParticles(config.particleNumber)
  }, [])

  if (skip) {
    return (
      <div id='canvas-wrapper' className='bg-black'>
        <canvas ref={canvas} />
      </div>
    )
  } else {
    return (
      <>
        <div id='bvg-video-wrapper' className='bg-black'>
          <div id='bvg-video-outline'>
            <video id='bvg-video' ref={video} autoPlay loop muted playsInline>
              <source
                src={require('../public/assets/front/cell-phones.mp4')}
                type='video/mp4'
              />
              <source
                src={require('../public/assets/front/cell-phones.webm')}
                type='video/webm'
              />
            </video>
          </div>
        </div>

        <svg className='clipping-paths'>
          <defs>
            <clipPath
              id='clip-00'
              clipPathUnits='objectBoundingBox'
              transform='scale(0.0005208333333333333, 0.000925925925925926)'
            >
              <path d='M531.75,678.5q-78.51,46-206.5,46h-230V31.5h220q119,0,192,41.5t73,135.5q0,59-36,97t-91,52q66,11,111.5,49.5t45.5,114.5Q610.25,632.5,531.75,678.5ZM389.75,166q-25.5-18.5-80.5-18.5h-50v161h56q52,0,76-19.5t24-63.5Q415.25,184.51,389.75,166Zm22,274.5q-29.5-22-85.5-22h-67v186h60q57,0,89.5-19t32.5-71Q441.25,462.51,411.75,440.5Z' />
              <path d='M942.24,596.5l130-565h168l-200,693h-202l-199-693h174Z' />
              <path d='M1339.73,648q-77.51-93.5-77.5-271.5,0-115,42-197t115.5-124q73.5-42,164.5-42,71,0,123.5,22.5t96.5,63.5l-86,89q-33-29-61.5-42t-64.5-13q-75,0-118,59.5t-43,184.5q0,134,32,189t103,55q47,0,86-21v-159h-87l-16-114h258v344q-114,70-242,70Q1417.23,741.5,1339.73,648Z' />
              <path d='M213.35,1006.3q-13.6,20-39,31t-60.2,11q-68.81,0-109.6-40l33.2-36.8q31.59,28,74.8,28,20.79,0,33.4-9t12.6-25q0-15.19-10.6-23.8t-39.4-17.4q-48.81-14.79-69.2-34.8T19,837.9q0-24.79,13.8-43.2t37.6-28q23.79-9.6,53-9.6,61.2,0,99.2,36l-30.8,35.6a100.15,100.15,0,0,0-30.2-17.4,98.56,98.56,0,0,0-33.4-5.8q-19.2,0-30.2,7T87,832.7a22.3,22.3,0,0,0,5,14.8q5,6,16.6,11.2t34.8,12.4q42.39,12.81,63,33T227,960.3Q227,986.31,213.35,1006.3Z' />
              <path d='M442,1009.3q-28.6,39-82.2,39-54,0-82.4-38.6T249,902.7q0-67.59,28.6-106.6t82.2-39q54,0,82.4,38.6t28.4,107Q470.55,970.31,442,1009.3Zm-48.8-181q-10.2-23.19-33.4-23.2t-33.4,23.2q-10.2,23.21-10.2,74.4t10.2,74.4q10.2,23.21,33.4,23.2,23.6,0,33.6-23.2t10-74.4Q403.35,851.51,393.15,828.3Z' />
              <path d='M588.94,811.1v73.2h96.8v47.2h-96.8v110h-66V764.3h182l-6.4,46.8Z' />
              <path d='M872.14,814.7v226.8h-65.6V814.7h-78V764.3h224.4l-6.4,50.4Z' />
              <path d='M1200.94,764.3l-32.4,277.2h-68l-20.4-198.4-22.4,198.4h-69.2l-30-277.2h61.2l9.59,221.2,22.81-189.2h56.8l21.2,189.2,13.6-221.2Z' />
              <path d='M1359.73,981.5h-81.2l-14.4,60h-68.8l84.8-277.2h79.6l84.8,277.2h-70.4Zm-70.8-47.2h60l-30-122.8Z' />
              <path d='M1649.13,895.7q-15,19-40.2,29l72.4,116.8h-74.4l-60-106h-18.4v106h-65.6V764.3h87.2q57.19,0,85.6,20.8t28.4,63.6Q1664.13,876.71,1649.13,895.7Zm-64-76.2q-11.4-9.19-35-9.2h-21.6v80h24.4q21.6,0,32.6-10t11-31.6Q1596.53,828.71,1585.13,819.5Z' />
              <path d='M1782.52,811.1v66.8h96v45.6h-96v70.8h115.61v47.2H1716.92V764.3h181.21l-6.81,46.8Z' />
            </clipPath>
          </defs>
        </svg>
      </>
    )
  }
}
