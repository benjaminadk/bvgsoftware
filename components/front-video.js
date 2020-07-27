export default function FrontVideo() {
  const canvas = React.useRef()

  React.useEffect(() => {
    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
    const ctx = canvas.current.getContext('2d')
    const config = {
      particleNumber: 200,
      maxParticleSize: 10,
      maxSpeed: 50,
      colorVariation: 20
    }
    const colorPalette = {
      bg: { r: 0, g: 0, b: 0 },
      matter: [
        { r: 239, g: 59, b: 125 },
        { r: 230, g: 230, b: 230 }
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
      const a = Math.random() + 0.25
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

    function onClick(e) {
      cleanUpArray()
      initParticles(config.particleNumber, e.clientX, e.clientY)
    }

    document.getElementById('canvas-wrapper').addEventListener('click', onClick)

    frame()

    initParticles(config.particleNumber)

    function click(x, y) {
      var ev = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      })

      var el = document.elementFromPoint(x, y)

      canvas.current.dispatchEvent(ev)
    }

    // for (let i = 5; i < 60; i += 2) {
    //   setTimeout(() => {
    //     click(
    //       Math.random() * canvas.current.width,
    //       Math.random() * canvas.current.height
    //     )
    //   }, i * 1000)
    // }

    function randomPop() {
      click(
        Math.random() * canvas.current.width,
        Math.random() * canvas.current.height
      )
    }

    var interval = setInterval(randomPop, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div id='canvas-wrapper' className='bg-black'>
      <h1 className='bvg-software tracking-in-expand'>BVG Software</h1>
      <canvas ref={canvas} />
    </div>
  )
}
