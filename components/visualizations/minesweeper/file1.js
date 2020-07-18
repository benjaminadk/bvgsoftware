// https://observablehq.com/@benjaminadk/minesweeper@968
import define1 from './file2.js'

export default function define(runtime, observer) {
  const main = runtime.module()
  main.variable(observer()).define(['md'], function (md) {
    return md`
# Minesweeper`
  })
  main
    .variable(observer('viewof level'))
    .define('viewof level', ['select'], function (select) {
      return select({
        title: 'Difficulty',
        options: [
          { label: 'Beginner', value: '0' },
          { label: 'Intermediate', value: '1' },
          { label: 'Expert', value: '2' }
        ],
        value: '0'
      })
    })
  main
    .variable(observer('level'))
    .define('level', ['Generators', 'viewof level'], (G, _) => G.input(_))
  main
    .variable(observer('viewof newGame'))
    .define('viewof newGame', ['button'], function (button) {
      return button('New Game')
    })
  main
    .variable(observer('newGame'))
    .define('newGame', ['Generators', 'viewof newGame'], (G, _) => G.input(_))
  main
    .variable(observer('minesweeper'))
    .define(
      'minesweeper',
      [
        'newGame',
        'opts',
        'd3',
        'createData',
        'location',
        'viewof newGame',
        'countColor',
        'level',
        'invalidation',
        'createFrame',
        'html'
      ],
      function (
        newGame,
        opts,
        d3,
        createData,
        location,
        $0,
        countColor,
        level,
        invalidation,
        createFrame,
        html
      ) {
        // temp fix to re-evaluate cell (goal is smiley face reset button)
        newGame

        // constants
        const {
          margin,
          cellSize,
          statusSize,
          statusButtonSize,
          statusDisplayWidth,
          gridWidth,
          gridHeight,
          bombs
        } = opts

        // root svg
        const svg = d3
          .create('svg')
          .attr('width', gridWidth * cellSize + margin * 2)
          .attr('height', gridHeight * cellSize + statusSize + margin * 2)

        // variables
        var timer
        var time = 0
        var data = createData()
        var flags = bombs
        var gameOver = false
        var firstMove = true

        // flag count / reset button / timer
        const statusG = svg
          .append('g')
          .attr('transform', `translate(${margin},${margin - 10})`)

        // game board
        const boardG = svg
          .append('g')
          .attr('transform', `translate(${margin},${statusSize + margin})`)

        // bottom layer - bombs and counts
        const baseG = boardG.append('g')

        // top layer - buttons and flags
        const buttonsG = boardG.append('g')

        // status bar background
        statusG
          .append('rect')
          .attr('width', gridWidth * cellSize)
          .attr('height', statusSize)
          .attr('fill', '#BDBDBD')

        // timer container
        statusG
          .append('rect')
          .attr('x', gridWidth * cellSize - statusDisplayWidth - 5)
          .attr('y', (statusSize - statusButtonSize) / 2)
          .attr('width', statusDisplayWidth)
          .attr('height', statusButtonSize)
          .attr('fill', '#000')

        // timer text
        statusG
          .append('text')
          .attr('id', 'time')
          .attr('class', 'digital')
          .attr('x', gridWidth * cellSize - statusDisplayWidth + 1)
          .attr('y', statusButtonSize / 2 + 6)
          .attr('text-anchor', 'start')
          .attr('alignment-baseline', 'middle')
          .attr('fill', 'red')
          .text(time.toString().padStart(3, '0'))

        // reset button
        statusG
          .append('rect')
          .attr('id', 'reset')
          .attr('x', (gridWidth * cellSize) / 2 - statusButtonSize / 2)
          .attr('y', (statusSize - statusButtonSize) / 2)
          .attr('width', statusButtonSize)
          .attr('height', statusButtonSize)
          .attr('fill', `url(${location}#button-smile)`)
          .on('mousedown', () =>
            svg
              .select('#reset')
              .attr('fill', `url(${location}#background-smile)`)
          )
          .on('mouseup', () =>
            svg.select('#reset').attr('fill', `url(${location}#button-smile)`)
          )
          .on('click', () => $0.dispatchEvent(new CustomEvent('input')))

        // flag count container
        statusG
          .append('rect')
          .attr('x', 5)
          .attr('y', (statusSize - statusButtonSize) / 2)
          .attr('width', statusDisplayWidth)
          .attr('height', statusButtonSize)
          .attr('fill', '#000')

        // flag count text
        statusG
          .append('text')
          .attr('id', 'flags')
          .attr('class', 'digital')
          .attr('x', 11)
          .attr('y', statusButtonSize / 2 + 6)
          .attr('text-anchor', 'start')
          .attr('alignment-baseline', 'middle')
          .attr('fill', 'red')
          .text(flags.toString().padStart(3, '0'))

        // bottom layer - cell background and bombs
        baseG
          .selectAll('rect')
          .data(data)
          .join('rect')
          .attr('class', 'layer1')
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', (d) =>
            d.isBomb ? `url(${location}#bomb)` : `url(${location}#background)`
          )

        // bottom layer - bomb counts
        baseG
          .selectAll('text')
          .data(data)
          .join('text')
          .attr('class', 'layer2')
          .attr('x', (d) => d.x + cellSize / 2)
          .attr('y', (d) => d.y + cellSize / 2 + 2)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('fill', (d) => (d.bombCount ? countColor(d.bombCount) : 'none'))
          .style('font-family', 'Arial, sans-serif')
          .style('font-weight', '1000')
          .text((d) => (d.bombCount > 0 ? d.bombCount : ''))

        // top layer - buttons
        buttonsG
          .selectAll('rect')
          .data(data)
          .join('rect')
          .attr('class', 'button')
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', `url(${location}#button)`)
          .attr('data-flagged', 0)
          .attr('data-index', (d) => d.index)
          .attr('data-bomb', (d) => (d.isBomb ? 1 : 0))
          .style('cursor', 'pointer')
          .on('click', onClick)
          .on('mousedown', onMouseDown)
          .on('mouseup', onMouseUp)
          .on('contextmenu', onContextMenu)

        // handle button click
        function onClick() {
          if (gameOver) {
            return
          }
          if (!timer) {
            initTimer()
          }
          var cell = d3.select(this)
          var index = cell.attr('data-index')
          var isFlagged = Number(cell.attr('data-flagged'))
          var isBomb = Number(cell.attr('data-bomb'))
          // if flagged do nothing
          if (isFlagged) {
            return
          }
          // else if a bomb you lose
          else if (isBomb) {
            if (firstMove) {
              $0.dispatchEvent(new CustomEvent('input'))
            }
            stopTimer()
            svg.select('#reset').attr('fill', `url(${location}#button-frown)`)
            svg.selectAll('[data-bomb="1"]').attr('fill', 'none')
            cell.attr('fill', `url(${location}#bomb-red)`)
            gameOver = true
          }
          // else clear cell/s
          else {
            firstMove = false
            var d = data[index]
            !d.bombCount && updateCells(d)
            cell.attr('fill', 'none')

            var cells = svg.selectAll('rect.button')
            var arr = Array.from(cells._groups[0])
            var left = arr.filter((el) => el.getAttribute('fill') !== 'none')
            if (left.length === bombs) {
              var l =
                level === '0'
                  ? 'Beginner'
                  : level === '1'
                  ? 'Intermediate'
                  : 'Expert'
              stopTimer()
              gameOver = true
              svg
                .select('#reset')
                .attr('fill', `url(${location}#button-sunglasses)`)
            }
          }
        }

        // recursive update to clear cells
        function updateCells(cell) {
          data.forEach((d) => (d.checked = false))

          function update(c) {
            c.checked = true
            c.neighbors.forEach((index) => {
              var n = data[index]
              if (!n.checked && !n.isBomb) {
                svg.select(`[data-index="${index}"]`).attr('fill', 'none')
                if (n.bombCount === 0) {
                  update(n, data)
                }
              }
            })
          }

          update(cell)
        }

        // flood algorithm to clear cells
        // function updateCells(cell) {
        //   data.forEach(d => d.checked = false)
        //   var queue = [cell]
        //   while(queue.length) {
        //     var current = queue.shift()
        //     current.checked = true
        //     current.neighbors.forEach(index => {
        //       var n = data[index]
        //       if(!n.checked && !n.isBomb) {
        //         svg.select(`[data-index="${index}"]`).attr('fill', 'none')
        //         if(n.bombCount === 0) {
        //           queue.push(n)
        //         }
        //       }
        //     })
        //   }
        // }

        // change reset face expression to shock
        function onMouseDown() {
          if (gameOver) {
            return
          }
          svg.select('#reset').attr('fill', `url(${location}#button-shock)`)
        }

        // change reset face expression to smile
        function onMouseUp() {
          if (gameOver) {
            return
          }
          svg.select('#reset').attr('fill', `url(${location}#button-smile)`)
        }

        // add/remove flags
        function onContextMenu() {
          d3.event.preventDefault()
          if (gameOver) {
            return
          }
          var cell = d3.select(this)
          var isFlagged = Number(cell.attr('data-flagged'))

          if (!isFlagged && !flags) {
            return
          } else if (isFlagged) {
            flags += 1
          } else {
            flags -= 1
          }

          cell
            .attr(
              'fill',
              isFlagged ? `url(${location}#button)` : `url(${location}#flag)`
            )
            .attr('data-flagged', isFlagged ? 0 : 1)

          svg.select('#flags').text(flags.toString().padStart(3, '0'))
        }

        // create timer
        function initTimer() {
          if (timer) clearInterval(timer)
          timer = setInterval(() => {
            time += 1
            if (time === 999) time = 1
            svg.select('#time').text(time.toString().padStart(3, '0'))
          }, 1000)
        }

        // cancel timer
        function stopTimer() {
          timer = clearInterval(timer)
          time = 0
          svg.select('#time').text(time.toString().padStart(3, '0'))
        }

        // clean up when cell updates
        invalidation.then(() => {
          clearInterval(timer)
        })

        const frame = createFrame()
        return html`<div style="position: relative;">
          ${frame}${svg.node()}
        </div>`
      }
    )
  main.variable(observer()).define(['md'], function (md) {
    return md`
---`
  })
  main.variable(observer('opts')).define('opts', ['level'], function (level) {
    return {
      margin: 40,
      cellSize: 25,
      statusSize: 50,
      statusButtonSize: 40,
      statusDisplayWidth: 60,
      gridWidth: level === '0' ? 9 : level === '1' ? 16 : 30,
      gridHeight: level === '0' ? 9 : 16,
      bombs: level === '0' ? 10 : level === '1' ? 40 : 99
    }
  })
  main
    .variable(observer('createFrame'))
    .define('createFrame', ['opts', 'html'], function (opts, html) {
      return function createFrame() {
        const { cellSize, gridWidth, gridHeight, statusSize, margin } = opts
        const btl =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/bordertl.gif'
        const btr =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/bordertr.gif'
        const btb =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/bordertb.gif'
        const blr =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/borderlr.gif'
        const bjl =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/borderjointl.gif'
        const bjr =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/borderjointr.gif'
        const bbl =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/borderbl.gif'
        const bbr =
          'https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/borderbr.gif'

        const frame = html`<div
          id="minesweeper-frame"
          style="position: absolute; top: ${margin / 2}px; left: ${margin / 2 +
          10}px; pointer-events: none;"
        >
          <span style="display: flex;">
            <img src=${btl} />
            ${[...Array(gridWidth)].map(
              (el, i) =>
                html`<img
                  src=${btb}
                  width=${cellSize}
                  height="10"
                  style="height: 10px;"
                />`
            )}
            <img src=${btr} />
          </span>

          <span style="display: flex;">
            <img
              src=${blr}
              width="10"
              height=${statusSize}
              style="height: ${statusSize}px;"
            />
            <span style="width: ${gridWidth * cellSize}px"></span>
            <img
              src=${blr}
              width="10"
              height=${statusSize}
              style="height: ${statusSize}px"
            />
          </span>

          <span style="display: flex;">
            <img src=${bjl} />
            ${[...Array(gridWidth)].map(
              (el, i) =>
                html`<img
                  src=${btb}
                  width=${cellSize}
                  height="10"
                  style="height: 10px;"
                />`
            )}
            <img src=${bjr} />
          </span>

          ${[...Array(gridHeight)].map(
            (el, i) => html`<span style="display: flex;">
              <img
                src=${blr}
                width="10"
                height=${cellSize}
                style="height: ${cellSize}px;"
              />
              <span style="width: ${gridWidth * cellSize}px"></span>
              <img
                src=${blr}
                width="10"
                height=${cellSize}
                style="height: ${cellSize}px;"
              />
            </span>`
          )}

          <span style="display: flex;">
            <img src=${bbl} />
            ${[...Array(gridWidth)].map(
              (el, i) =>
                html`<img
                  src=${btb}
                  width=${cellSize}
                  height="10"
                  style="height: 10px;"
                />`
            )}
            <img src=${bbr} />
          </span>
        </div>`

        return frame
      }
    })
  main
    .variable(observer('countColor'))
    .define('countColor', ['d3'], function (d3) {
      return d3
        .scaleOrdinal()
        .domain([1, 2, 3, 4, 5, 6, 7, 8])
        .range([
          '#0A06EA',
          '#137B0F',
          '#EA0E06',
          '#05076B',
          '#740B0D',
          '#35978A',
          '#333333',
          '#808080'
        ])
    })
  main
    .variable(observer('createData'))
    .define('createData', ['opts', 'findNeighbors'], function (
      opts,
      findNeighbors
    ) {
      return () => {
        /*
       1 | 2 | 3
       4 | C | 5
       6 | 7 | 8
  */

        const { cellSize, gridWidth, gridHeight, bombs } = opts
        const total = gridWidth * gridHeight
        const bombIndices = []

        function generateBomb() {
          var index = Math.floor(Math.random() * total)
          if (bombIndices.includes(index)) {
            index = generateBomb()
          }
          return index
        }

        for (let i = 0; i < bombs; i++) {
          bombIndices.push(generateBomb())
        }

        const data = []
        for (let i = 0; i < gridHeight; i++) {
          for (let j = 0; j < gridWidth; j++) {
            let index = j + i * gridWidth
            data.push({
              index,
              isBomb: bombIndices.includes(index),
              x: j * cellSize,
              y: i * cellSize,
              checked: false
            })
          }
        }
        return data.map(findNeighbors)
      }
    })
  main
    .variable(observer('findNeighbors'))
    .define('findNeighbors', ['opts'], function (opts) {
      return (cell, i, data) => {
        const { margin, cellSize, gridWidth, gridHeight } = opts
        const total = gridWidth * gridHeight

        var neighbors
        var bombCount = 0
        var i = cell.index
        var one = i - gridWidth - 1
        var two = i - gridWidth
        var three = i - gridWidth + 1
        var four = i - 1
        var five = i + 1
        var six = i + gridWidth - 1
        var seven = i + gridWidth
        var eight = i + gridWidth + 1
        // middle cells
        if (
          i >= gridWidth &&
          i < total - gridWidth &&
          cell.x > 0 &&
          cell.x < gridWidth * cellSize - cellSize
        ) {
          if (data[one].isBomb) bombCount += 1 // 1
          if (data[two].isBomb) bombCount += 1 // 2
          if (data[three].isBomb) bombCount += 1 // 3
          if (data[four].isBomb) bombCount += 1 // 4
          if (data[five].isBomb) bombCount += 1 // 5
          if (data[six].isBomb) bombCount += 1 // 6
          if (data[seven].isBomb) bombCount += 1 // 7
          if (data[eight].isBomb) bombCount += 1 // 8
          neighbors = [one, two, three, four, five, six, seven, eight]
        }
        // first row
        if (i < gridWidth) {
          // first cell first row
          if (i === 0) {
            if (data[five].isBomb) bombCount += 1 // 5
            if (data[seven].isBomb) bombCount += 1 // 7
            if (data[eight].isBomb) bombCount += 1 // 8
            neighbors = [five, seven, eight]
          }
          // last cell first row
          else if (i === gridWidth - 1) {
            if (data[four].isBomb) bombCount += 1 // 4
            if (data[six].isBomb) bombCount += 1 // 6
            if (data[seven].isBomb) bombCount += 1 // 7
            neighbors = [four, six, seven]
          }
          // rest of first row
          else {
            if (data[four].isBomb) bombCount += 1 // 4
            if (data[five].isBomb) bombCount += 1 // 5
            if (data[six].isBomb) bombCount += 1 // 6
            if (data[seven].isBomb) bombCount += 1 // 7
            if (data[eight].isBomb) bombCount += 1 // 8
            neighbors = [four, five, six, seven, eight]
          }
        }
        // last row
        if (i > total - gridWidth - 1) {
          // first cell last row
          if (cell.x === 0) {
            if (data[two].isBomb) bombCount += 1 // 2
            if (data[three].isBomb) bombCount += 1 // 3
            if (data[five].isBomb) bombCount += 1 // 5
            neighbors = [two, three, five]
          }
          // last cell last row
          else if (i === total - 1) {
            if (data[one].isBomb) bombCount += 1 // 1
            if (data[two].isBomb) bombCount += 1 // 2
            if (data[four].isBomb) bombCount += 1 // 4
            neighbors = [one, two, four]
          }
          // rest of last row
          else {
            if (data[one].isBomb) bombCount += 1 // 1
            if (data[two].isBomb) bombCount += 1 // 2
            if (data[three].isBomb) bombCount += 1 // 3
            if (data[four].isBomb) bombCount += 1 // 4
            if (data[five].isBomb) bombCount += 1 // 5
            neighbors = [one, two, three, four, five]
          }
        }
        // left column minus corners
        if (i % gridWidth === 0 && i !== 0 && i !== total - gridWidth) {
          if (data[two].isBomb) bombCount += 1 // 2
          if (data[three].isBomb) bombCount += 1 // 3
          if (data[five].isBomb) bombCount += 1 // 5
          if (data[seven].isBomb) bombCount += 1 // 7
          if (data[eight].isBomb) bombCount += 1 // 8
          neighbors = [two, three, five, seven, eight]
        }
        // right column minus corners
        if (
          (i + 1) % gridWidth === 0 &&
          i !== gridWidth - 1 &&
          i !== total - 1
        ) {
          if (data[one].isBomb) bombCount += 1 // 1
          if (data[two].isBomb) bombCount += 1 // 2
          if (data[four].isBomb) bombCount += 1 // 4
          if (data[six].isBomb) bombCount += 1 // 6
          if (data[seven].isBomb) bombCount += 1 // 7
          neighbors = [one, two, four, six, seven]
        }
        // reset to zero if cell is a bomb
        if (cell.isBomb) {
          bombCount = 0
          neighbors = []
        }
        return {
          ...cell,
          bombCount,
          neighbors
        }
      }
    })
  main
    .variable(observer('style'))
    .define('style', ['html', 'location'], function (html, location) {
      return html`<style>
        @font-face {
          font-family: 'Digital';
          src: url('https://observable-notebooks.s3-us-west-1.amazonaws.com/minesweeper/digital.ttf')
            format('truetype');
        }

        body {
          font-family: Ubuntu, sans-serif;
        }

        select {
          padding: 4px;
          margin-bottom: 5px;
          outline: 0;
          border: 1px solid;
        }

        svg {
          user-select: none;
        }

        .digital {
          font-family: 'Digital', monospace;
          font-size: 36px;
          font-weight: 600;
          filter: url(${location}#glow);
        }

        details {
          cursor: pointer;
        }

        summary {
          outline: 0;
        }
      </style>`
    })
  main
    .variable(observer('pattern'))
    .define('pattern', ['html', 'location'], function (html, location) {
      return html`<svg height="0">
        <defs>
          <pattern id="button" viewBox="0 0 25 25" width="100%" height="100%">
            <path fill="#BDBDBD" d="M2.5 2.5h20v20h-20z" />
            <path
              d="M24.991 25.012h-2.5V25H0l2.458-2.458V22.5h20.033V2.462h.042L24.991.004V22.5h.017V25h-.017z"
              fill="#7D7D7D"
            />
            <path
              d="M.043-.024h2.5v.012h22.491l-2.458 2.458v.042H2.543v20.038h-.042L.043 24.984V2.488H.026v-2.5h.017z"
              fill="#fff"
            />
          </pattern>

          <pattern id="flag" viewBox="0 0 25 25" width="100%" height="100%">
            <path fill="#BDBDBD" d="M2.5 2.5h20v20h-20z" />
            <path
              d="M24.991 25.012h-2.5V25H0l2.458-2.458V22.5h20.033V2.462h.042L24.991.004V22.5h.017V25h-.017z"
              fill="#777"
            />
            <path
              d="M.043-.024h2.5v.012h22.491l-2.458 2.458v.042H2.543v20.038h-.042L.043 24.984V2.488H.026v-2.5h.017z"
              fill="#fff"
            />
            <g>
              <path
                d="M8.2155 17.3815h2.4543v-1.065h3.1353v-2.8867h.9266v2.8868h1.0954v1.0649h2.4246v1.5747H8.2155z"
                fill="#040404"
              />
              <path
                d="M13.7746 6.4977h.957v6.9478h-.957v-.0196L7.7932 9.9732l5.9814-3.4544z"
                fill="red"
              />
            </g>
          </pattern>

          <pattern
            id="background"
            viewBox="0 0 25 25"
            width="100%"
            height="100%"
          >
            <path fill="#333" d="M0 0h25v25H0z" />
            <path fill="#d8d8d8" d="M.25.25h24.5v24.5H.25z" />
          </pattern>

          <pattern id="bomb" viewBox="0 0 25 25" width="100%" height="100%">
            <defs>
              <radialGradient
                id="a"
                gradientUnits="userSpaceOnUse"
                cx="10.216"
                cy="9.362"
                r="8.421"
                gradientTransform="matrix(.37423 .44278 -.40906 .34574 10.09 1.926)"
              >
                <stop offset="0" stop-color="#fff" />
                <stop offset="1" />
              </radialGradient>
            </defs>
            <path fill="#333" d="M0 0h25v25H0z" />
            <path fill="#d8d8d8" d="M.25.25h24.5v24.5H.25z" />
            <path
              d="M19.397 19.216l-3.604-2.952c-.807.685-1.819 1.136-2.93 1.247l-.512 4.573-.453-4.562c-1.141-.089-2.181-.535-3.009-1.226L5.341 19.13l2.873-3.507a5.3394 5.3394 0 0 1-1.239-3.035l-4.502-.503 4.514-.45c.113-1.137.583-2.17 1.295-2.986L5.427 5.074l3.551 2.909a5.3383 5.3383 0 0 1 2.977-1.157l.517-4.62.462 4.642c1.089.124 2.079.574 2.87 1.25l3.678-2.938-2.987 3.648c.646.8 1.067 1.79 1.166 2.873l4.689.524-4.689.467a5.33 5.33 0 0 1-1.182 2.891z"
              fill="url(${location}#a)"
            />
          </pattern>

          <pattern id="bomb-red" viewBox="0 0 25 25" width="100%" height="100%">
            <defs>
              <radialGradient
                id="a"
                gradientUnits="userSpaceOnUse"
                cx="10.216"
                cy="9.362"
                r="8.421"
                gradientTransform="matrix(.37423 .44278 -.40906 .34574 10.09 1.926)"
              >
                <stop offset="0" stop-color="#fff" />
                <stop offset="1" />
              </radialGradient>
            </defs>
            <path fill="#333" d="M0 0h25v25H0z" />
            <path fill="#fc2323" d="M.25.25h24.5v24.5H.25z" />
            <path
              d="M19.397 19.216l-3.604-2.952c-.807.685-1.819 1.136-2.93 1.247l-.512 4.573-.453-4.562c-1.141-.089-2.181-.535-3.009-1.226L5.341 19.13l2.873-3.507a5.3394 5.3394 0 0 1-1.239-3.035l-4.502-.503 4.514-.45c.113-1.137.583-2.17 1.295-2.986L5.427 5.074l3.551 2.909a5.3383 5.3383 0 0 1 2.977-1.157l.517-4.62.462 4.642c1.089.124 2.079.574 2.87 1.25l3.678-2.938-2.987 3.648c.646.8 1.067 1.79 1.166 2.873l4.689.524-4.689.467a5.33 5.33 0 0 1-1.182 2.891z"
              fill="url(${location}#a)"
            />
          </pattern>

          <pattern
            id="button-smile"
            viewBox="0 0 25 25"
            width="100%"
            height="100%"
          >
            <path fill="#BDBDBD" d="M2.5 2.5h20v20h-20z" />
            <path
              d="M24.991 25.012h-2.5V25H0l2.458-2.458V22.5h20.033V2.462h.042L24.991.004V22.5h.017V25h-.017z"
              fill="#777"
            />
            <path
              d="M.043-.024h2.5v.012h22.491l-2.458 2.458v.042H2.543v20.038h-.042L.043 24.984V2.488H.026v-2.5h.017z"
              fill="#fff"
            />
            <circle
              cx="12.638"
              cy="12.519"
              r="7.626"
              fill="#ffe81d"
              stroke-width=".5"
              stroke="#020202"
            />
            <circle cx="10.308" cy="9.952" r="1.343" />
            <circle cx="15.205" cy="9.913" r="1.343" />
            <path
              d="M11.809 17.649c-1.284-.246-2.29-.974-2.639-1.909-.021-.056-.039-.11-.054-.165h.764c.256.714 1.001 1.335 2.119 1.55 1.027.198 2.12-.02 2.868-.57.393-.289.646-.627.771-.98h.765c-.407 1.443-2.424 2.491-4.594 2.074z"
            />
          </pattern>

          <pattern
            id="background-smile"
            viewBox="0 0 25 25"
            width="100%"
            height="100%"
          >
            <path fill="#d8d8d8" d="M22.5 22.5h-20v-20h20z" />
            <path
              d="M.009-.012h2.5V0H25l-2.458 2.458V2.5H2.509v20.038h-.042L.009 24.996V2.5h-.017V0h.017z"
              fill="#777"
            />
            <path
              d="M24.957 25.024h-2.5v-.012H-.034l2.458-2.458v-.042h20.033V2.474h.042L24.957.016v22.496h.017v2.5h-.017z"
              fill="#fff"
            />
            <circle
              cx="12.717"
              cy="12.559"
              r="7.626"
              fill="#ffe81d"
              stroke-width=".5"
              stroke="#020202"
            />
            <circle cx="10.387" cy="9.992" r="1.343" />
            <circle cx="15.284" cy="9.953" r="1.343" />
            <path
              d="M11.888 17.689c-1.284-.246-2.29-.974-2.639-1.909-.021-.056-.039-.11-.054-.165h.764c.256.714 1.001 1.335 2.119 1.55 1.027.198 2.12-.02 2.868-.57.393-.289.646-.627.771-.98h.765c-.407 1.443-2.424 2.491-4.594 2.074z"
            />
          </pattern>

          <pattern
            id="button-frown"
            viewBox="0 0 25 25"
            width="100%"
            height="100%"
          >
            <path fill="#BDBDBD" d="M2.5 2.5h20v20h-20z" />
            <path
              d="M24.991 25.012h-2.5V25H0l2.458-2.458V22.5h20.033V2.462h.042L24.991.004V22.5h.017V25h-.017z"
              fill="#777"
            />
            <path
              d="M.043-.024h2.5v.012h22.491l-2.458 2.458v.042H2.543v20.038h-.042L.043 24.984V2.488H.026v-2.5h.017z"
              fill="#fff"
            />
            <circle
              cx="12.638"
              cy="12.519"
              r="7.626"
              fill="#ffe81d"
              stroke-width=".25"
              stroke="#020202"
            />
            <path
              d="M11.572 15.114c-1.284.246-2.29.974-2.639 1.909-.021.056-.039.11-.054.165h.764c.256-.714 1.001-1.335 2.119-1.55 1.027-.198 2.12.02 2.868.57.393.289.646.627.771.98h.765c-.407-1.443-2.424-2.491-4.594-2.074z"
            />
            <path
              d="M8.881 8.997l.366-.3404.8765.9425.9425-.8763.3405.3661-.9426.8764.8764.9425-.3662.3405-.8763-.9425-.9425.8763-.3405-.3661.9425-.8764zM13.6202 8.8788l.3662-.3405.8764.9425.9425-.8764.3405.3662-.9426.8764.8764.9425-.3662.3405-.8763-.9426-.9425.8764-.3405-.3661.9425-.8764z"
            />
          </pattern>

          <pattern
            id="button-shock"
            viewBox="0 0 25 25"
            width="100%"
            height="100%"
          >
            <path fill="#BDBDBD" d="M2.5 2.5h20v20h-20z" />
            <path
              d="M24.991 25.012h-2.5V25H0l2.458-2.458V22.5h20.033V2.462h.042L24.991.004V22.5h.017V25h-.017z"
              fill="#777"
            />
            <path
              d="M.043-.024h2.5v.012h22.491l-2.458 2.458v.042H2.543v20.038h-.042L.043 24.984V2.488H.026v-2.5h.017z"
              fill="#fff"
            />
            <circle
              cx="12.638"
              cy="12.519"
              r="7.626"
              fill="#ffe81d"
              stroke-width=".25"
              stroke="#020202"
            />
            <circle cx="10.11" cy="9.833" r="2.014" />
            <circle
              cx="10.11"
              cy="9.833"
              r="2.014"
              transform="translate(5.0559 -.0384)"
            />
            <path
              d="M14.2126 14.578499999999998a2.227 2.227 0 1 0-3.1495 3.1494 2.227 2.227 0 1 0 3.1495-3.1494zm-.3147.3147a1.782 1.782 0 0 1-2.5201 2.52 1.782 1.782 0 0 1 2.5201-2.52z"
              bx:shape="ring 347 468 1.782 1.782 2.227 2.227 1@03fa4d1c"
            />
          </pattern>

          <pattern
            id="button-sunglasses"
            viewBox="0 0 25 25"
            width="100%"
            height="100%"
          >
            <path fill="#BDBDBD" d="M2.5 2.5h20v20h-20z" />
            <path
              d="M24.991 25.012h-2.5V25H0l2.458-2.458V22.5h20.033V2.462h.042L24.991.004V22.5h.017V25h-.017z"
              fill="#777"
            />
            <path
              d="M.043-.024h2.5v.012h22.491l-2.458 2.458v.042H2.543v20.038h-.042L.043 24.984V2.488H.026v-2.5h.017z"
              fill="#fff"
            />
            <circle
              cx="12.638"
              cy="12.519"
              r="7.626"
              fill="#ffe81d"
              stroke-width=".25"
              stroke="#020202"
            />
            <path
              d="M11.5647 17.591c-1.5624-.4057-2.7866-1.6195-3.21-3.183a4.0835 4.0835 0 0 1-.0669-.2759l.772.8904s1.031 1.4415 2.7369 1.6907c1.7949.2629 3.7353-.4828 4.4766-1.8603.3031-.565-.201.5517-.049-.0398l.9305-.7112c-.4948 2.4157-2.9498 4.177-5.5901 3.489z"
            />
            <path
              d="M10.026 8.1203q3.0499.0309 1.5742 2.8113-1.4754 2.779-3.0495-.0323-1.5742-2.8113 1.4753-2.779z"
            />
            <path
              d="M10.388 9.005c.147-1.031 1.766-1.082 2.267-1.05.607.038 2.222.307 2.116 1.049"
              stroke="#000"
              stroke-width=".2"
              fill="none"
            />
            <path
              d="M8.2065 8.7862l-2.0368-.235M17.1377 8.9868l2.0988-.1616"
              fill="#d8d8d8"
              stroke="#000"
              stroke-width=".2"
            />
            <path
              d="M15.39 8.145q3.0958.113 1.5741 2.8113-1.5207 2.698-3.0949-.1134Q12.2951 8.0316 15.39 8.145z"
            />
          </pattern>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="red" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" style="stop-color: #d21917; stop-opacity: 1;" />
            <stop offset="100%" style="stop-color: #fb5119; stop-opacity: 1;" />
          </linearGradient>
          <mask id="red-gradient">
            <linearGradient id="red" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" style="stop-color: #d21917; stop-opacity: 1;" />
              <stop
                offset="100%"
                style="stop-color: #fb5119; stop-opacity: 1;"
              />
            </linearGradient>
          </mask>
        </defs>
      </svg>`
    })
  main.variable(observer('d3')).define('d3', ['require'], function (require) {
    return require('d3@5')
  })
  const child1 = runtime.module(define1)
  main.import('select', child1)
  main.import('button', child1)
  return main
}
