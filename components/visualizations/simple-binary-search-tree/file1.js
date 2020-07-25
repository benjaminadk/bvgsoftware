import define1 from './file2'

export default function define(runtime, observer) {
  const main = runtime.module()
  main.variable(observer()).define(['md'], function (md) {
    return md`
# Simple Binary Search Tree`
  })
  main
    .variable(observer('viewof reset1'))
    .define('viewof reset1', ['button'], function (button) {
      return button('Re-Shuffle Array Values')
    })
  main
    .variable(observer('reset1'))
    .define('reset1', ['Generators', 'viewof reset1'], (G, _) => G.input(_))
  main
    .variable(observer('weBeSearchingOver1'))
    .define('weBeSearchingOver1', ['reset1', 'd3'], function (reset1, d3) {
      reset1
      return d3.shuffle(d3.range(0, 100))
    })
  main
    .variable(observer('viewof searchFor1'))
    .define('viewof searchFor1', ['number', 'weBeSearchingOver1'], function (
      number,
      weBeSearchingOver1
    ) {
      return number({
        min: 0,
        max: weBeSearchingOver1.length - 1,
        step: 1,
        value: 50,
        submit: 'Watch Search'
      })
    })
  main
    .variable(observer('searchFor1'))
    .define('searchFor1', ['Generators', 'viewof searchFor1'], (G, _) =>
      G.input(_)
    )
  main
    .variable(observer('linear1'))
    .define('linear1', ['weBeSearchingOver1', 'searchFor1', 'md'], function (
      weBeSearchingOver1,
      searchFor1,
      md
    ) {
      var count = 0
      for (let i = 0; i < weBeSearchingOver1.length; i++) {
        if (weBeSearchingOver1[i] === searchFor1) break
        count++
      }
      return md`*Linear Search* of ${weBeSearchingOver1.length} items took **${count}** recursions`
    })
  main
    .variable(observer('binary1'))
    .define('binary1', ['recurs1', 'md', 'weBeSearchingOver1'], function (
      recurs1,
      md,
      weBeSearchingOver1
    ) {
      return recurs1
        ? md`*Binary Search Tree* of ${weBeSearchingOver1.length} items took **${recurs1}** recursions`
        : md`
Sumbit a value
          `
    })
  main
    .variable(observer('tree1'))
    .define(
      'tree1',
      [
        'BinarySearchTree',
        'weBeSearchingOver1',
        'd3',
        'searchFor1',
        'mutable recurs1',
        'length'
      ],
      function (
        BinarySearchTree,
        weBeSearchingOver1,
        d3,
        searchFor1,
        $0,
        length
      ) {
        const width = 800
        const height = 600
        const margin = 20
        const radius = 10

        const bst = new BinarySearchTree()
        const data = weBeSearchingOver1

        data.forEach((d) => {
          bst.insert(d)
        })

        const tree = d3.tree().size([width, height])
        const root = d3.hierarchy(bst.root, function (d) {
          d.children = []
          if (d.left) {
            d.children.push(d.left)
          }
          if (d.right) {
            d.children.push(d.right)
          }
          return d.children
        })

        root.x0 = width / 2
        root.y0 = 0

        var treeData = tree(root)
        var nodes = treeData.descendants()
        var links = treeData.descendants().slice(1)

        var svg = d3
          .create('svg')
          .attr('width', width + margin * 2)
          .attr('height', height + margin * 2)

        var g = svg
          .append('g')
          .attr('transform', `translate(${margin},${margin})`)

        var link = g.selectAll('line.link').data(links)

        var linkEnter = link
          .enter()
          .append('line')
          .attr('class', 'link')
          .attr('data-value', (d) => d.data.value)
          .attr('x1', (d) => d.parent.x)
          .attr('y1', (d) => d.parent.y)
          .attr('x2', (d) => d.x)
          .attr('y2', (d) => d.y)
          .attr('stroke', '#ddd')
          .attr('stroke-dasharray', '4px 8px')

        var node = g.selectAll('g.node').data(nodes)

        var nodeEnter = node.enter().append('g').attr('class', 'node')

        nodeEnter
          .append('circle')
          .attr('data-value', (d) => d.data.value)
          .attr('r', radius)
          .attr('fill', '#FFF')
          .attr('stroke', '#ddd')
          .attr('transform', (d) => `translate(${d.x},${d.y})`)

        nodeEnter
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('transform', (d) => `translate(${d.x},${d.y + 1})`)
          .style('font-size', '14px')
          .text((d) => d.data.value)

        if (searchFor1) {
          var path = bst.getSearchPath(searchFor1)
          $0.value = path.length
          var pathNodes = nodes.filter((n) => path.includes(n.value))
          var pathLinks = links.filter((l) => path.includes(l.value))

          for (let j = 0; j < path.length; j++) {
            g.selectAll('line.path')
              .data(pathLinks)
              .enter()
              .append('line')
              .attr('class', 'path')
              .attr('x1', (d) => d.parent.x)
              .attr('y1', (d) => d.parent.y)
              .attr('x2', (d) => d.x)
              .attr('y2', (d) => d.y)
              .attr('stroke', 'steelblue')
              .attr('stroke-width', 2)
              .attr('stroke-dasharray', (d) => length(d))
              .attr('stroke-dashoffset', (d) => length(d))
              .transition()
              .duration(500)
              .delay((d, i) => i * 500 + 1000)
              .attr('stroke-dashoffset', (d) => 0)

            g.selectAll('circle.path')
              .data(pathNodes)
              .enter()
              .append('circle')
              .attr('class', 'path')
              .attr('r', radius)
              .attr('fill', '#FFF')
              .attr('transform', (d) => `translate(${d.x},${d.y})`)
              .attr('stroke', 'steelblue')
              .attr('stroke-width', 2)
              .attr('stroke-dasharray', 2 * Math.PI * radius)
              .attr('stroke-dashoffset', 2 * Math.PI * radius)
              .transition()
              .duration(500)
              .delay((d, i) => i * 500)
              .attr('stroke-dashoffset', 0)

            g.selectAll('text.path')
              .data(pathNodes)
              .enter()
              .append('text')
              .attr('class', 'path')
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'middle')
              .attr('transform', (d) => `translate(${d.x},${d.y + 1})`)
              .style('font-size', '14px')
              .text((d) => d.data.value)
          }
        }

        return svg.node()
      }
    )
  main
    .variable(observer('viewof reset2'))
    .define('viewof reset2', ['button'], function (button) {
      return button('Re-Shuffle Array Values')
    })
  main
    .variable(observer('reset2'))
    .define('reset2', ['Generators', 'viewof reset2'], (G, _) => G.input(_))
  main
    .variable(observer('weBeSearchingOver2'))
    .define('weBeSearchingOver2', ['reset2', 'd3'], function (reset2, d3) {
      reset2
      return d3.shuffle(d3.range(0, 10000))
    })
  main
    .variable(observer('viewof searchFor2'))
    .define('viewof searchFor2', ['number', 'weBeSearchingOver2'], function (
      number,
      weBeSearchingOver2
    ) {
      return number({
        min: 0,
        max: weBeSearchingOver2,
        step: 1,
        value: 5000,
        submit: 'Watch Search'
      })
    })
  main
    .variable(observer('searchFor2'))
    .define('searchFor2', ['Generators', 'viewof searchFor2'], (G, _) =>
      G.input(_)
    )
  main
    .variable(observer('linear2'))
    .define('linear2', ['weBeSearchingOver2', 'searchFor2', 'md'], function (
      weBeSearchingOver2,
      searchFor2,
      md
    ) {
      var count = 0
      for (let i = 0; i < weBeSearchingOver2.length; i++) {
        if (weBeSearchingOver2[i] === searchFor2) break
        count++
      }
      return md`*Linear Search* of ${weBeSearchingOver2.length} items took **${count}** recursions`
    })
  main
    .variable(observer('binary2'))
    .define('binary2', ['recurs2', 'md'], function (recurs2, md) {
      return recurs2
        ? md`*Binary Search Tree* of 10000 items took **${recurs2}** recursions`
        : md`
Sumbit a value
          `
    })
  main
    .variable(observer('tree2'))
    .define(
      'tree2',
      ['BinarySearchTree', 'd3', 'searchFor2', 'mutable recurs2', 'length'],
      function (BinarySearchTree, d3, searchFor2, $0, length) {
        const width = 800
        const height = 600
        const margin = 20
        const radius = 0.5

        const bst = new BinarySearchTree()
        const data = d3.shuffle(d3.range(0, 10000))
        data.forEach((d) => {
          bst.insert(d)
        })

        const tree = d3.tree().size([width, height])
        const root = d3.hierarchy(bst.root, function (d) {
          d.children = []
          if (d.left) {
            d.children.push(d.left)
          }
          if (d.right) {
            d.children.push(d.right)
          }
          return d.children
        })

        root.x0 = width / 2
        root.y0 = 0

        var treeData = tree(root)
        var nodes = treeData.descendants()
        var links = treeData.descendants().slice(1)

        var svg = d3
          .create('svg')
          .attr('width', width + margin * 2)
          .attr('height', height + margin * 2)

        var g = svg
          .append('g')
          .attr('transform', `translate(${margin},${margin})`)

        var link = g.selectAll('line.link').data(links)

        var linkEnter = link
          .enter()
          .append('line')
          .attr('class', 'link')
          .attr('data-value', (d) => d.data.value)
          .attr('x1', (d) => d.parent.x)
          .attr('y1', (d) => d.parent.y)
          .attr('x2', (d) => d.x)
          .attr('y2', (d) => d.y)
          .attr('stroke', '#ddd')
          .attr('stroke-width', 0.5)

        var node = g.selectAll('g.node').data(nodes)

        var nodeEnter = node.enter().append('g').attr('class', 'node')

        nodeEnter
          .append('circle')
          .attr('data-value', (d) => d.data.value)
          .attr('r', radius)
          .attr('fill', '#000')
          .attr('transform', (d) => `translate(${d.x},${d.y})`)

        if (searchFor2) {
          var path = bst.getSearchPath(searchFor2)
          $0.value = path.length
          var pathNodes = nodes.filter((n) => path.includes(n.value))
          var pathLinks = links.filter((l) => path.includes(l.value))

          for (let j = 0; j < path.length; j++) {
            g.selectAll('line.path')
              .data(pathLinks)
              .enter()
              .append('line')
              .attr('class', 'path')
              .attr('x1', (d) => d.parent.x)
              .attr('y1', (d) => d.parent.y)
              .attr('x2', (d) => d.x)
              .attr('y2', (d) => d.y)
              .attr('stroke', 'steelblue')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', (d) => length(d))
              .attr('stroke-dashoffset', (d) => length(d))
              .transition()
              .duration(500)
              .delay((d, i) => i * 500 + 500)
              .attr('stroke-dashoffset', (d) => 0)

            g.selectAll('circle.path')
              .data(pathNodes)
              .enter()
              .append('circle')
              .attr('class', 'path')
              .attr('r', radius * 4)
              .attr('fill', 'none')
              .attr('transform', (d) => `translate(${d.x},${d.y})`)
              .transition()
              .duration(500)
              .delay((d, i) => i * 500)
              .attr('fill', 'steelblue')
          }
        }

        return svg.node()
      }
    )
  main
    .variable(observer('weBeSearchingOver3'))
    .define('weBeSearchingOver3', ['d3'], function (d3) {
      return d3.shuffle(d3.range(0, 100000))
    })
  main
    .variable(observer('viewof searchFor3'))
    .define('viewof searchFor3', ['number', 'weBeSearchingOver3'], function (
      number,
      weBeSearchingOver3
    ) {
      return number({
        min: 0,
        max: weBeSearchingOver3,
        step: 1,
        value: 50000,
        submit: 'Watch Search'
      })
    })
  main
    .variable(observer('searchFor3'))
    .define('searchFor3', ['Generators', 'viewof searchFor3'], (G, _) =>
      G.input(_)
    )
  main
    .variable(observer())
    .define(['weBeSearchingOver3', 'searchFor3', 'md'], function (
      weBeSearchingOver3,
      searchFor3,
      md
    ) {
      var count = 0
      for (let i = 0; i < weBeSearchingOver3.length; i++) {
        if (weBeSearchingOver3[i] === searchFor3) break
        count++
      }
      return md`*Linear Search* of ${weBeSearchingOver3.length} items took **${count}** recursions`
    })
  main.variable(observer()).define(['recurs3', 'md'], function (recurs3, md) {
    return recurs3
      ? md`*Binary Search Tree* of 100000 items took **${recurs3}** recursions`
      : md`
Sumbit a value
        `
  })
  main
    .variable(observer('viewof spread'))
    .define('viewof spread', ['html'], function (html) {
      return html`<input
        type="range"
        min="0.05"
        value="0.4"
        max="5"
        step="0.01"
      />`
    })
  main
    .variable(observer('spread'))
    .define('spread', ['Generators', 'viewof spread'], (G, _) => G.input(_))
  main
    .variable(observer())
    .define(
      [
        'DOM',
        'width',
        'BinarySearchTree',
        'weBeSearchingOver3',
        'd3',
        'spread',
        'searchFor3',
        'mutable recurs3'
      ],
      function (
        DOM,
        width,
        BinarySearchTree,
        weBeSearchingOver3,
        d3,
        spread,
        searchFor3,
        $0
      ) {
        const height = 600
        const margin = 20
        const c = DOM.context2d(width, height, 1)

        const bst = new BinarySearchTree()
        const data = weBeSearchingOver3

        data.forEach((d) => {
          bst.insert(d)
        })

        const hierarchy = d3.hierarchy(bst.root, function (d) {
          d.children = []
          if (d.left) {
            d.children.push(d.left)
          }
          if (d.right) {
            d.children.push(d.right)
          }
          return d.children
        })

        const tree = d3
          .tree()
          .size([width - margin * 2, height - margin * 2])
          .nodeSize([spread, 15])

        const t = tree(hierarchy)
        const nodes = t.descendants()
        const links = t.links()

        const linkVertical = d3
          .linkVertical()
          .context(c)
          .x((d) => d.x + 10)
          .y((d) => d.y + 10)

        function draw() {
          c.strokeStyle = '#ccc'
          c.lineWidth = 1

          c.beginPath()
          for (let link of links) linkVertical(link)
          c.stroke()

          const circle = d3.symbol().type(d3.symbolCircle).size(5).context(c)

          for (const node of nodes) {
            c.beginPath()
            c.save()
            c.fillStyle = '#000'
            c.translate(node.x + 10, node.y + 10)
            circle(node)
            c.fill()
            c.restore()
          }

          if (searchFor3) {
            var path = bst.getSearchPath(searchFor3)
            $0.value = path.length
            var pathNodes = nodes.filter((n) => path.includes(n.value))
            var pathLinks = links.filter((l) => path.includes(l.target.value))

            c.strokeStyle = 'steelblue'
            c.lineWidth = 2

            c.beginPath()
            for (let link of pathLinks) linkVertical(link)
            c.stroke()

            const circle = d3.symbol().type(d3.symbolCircle).size(10).context(c)

            for (const node of pathNodes) {
              c.beginPath()
              c.save()
              c.fillStyle = 'steelblue'
              c.translate(node.x + 10, node.y + 10)
              circle(node)
              c.fill()
              c.restore()
            }
          }
        }

        function zoomed() {
          c.save()
          c.clearRect(0, 0, width, height)
          c.translate(d3.event.transform.x, d3.event.transform.y)
          c.scale(d3.event.transform.k, d3.event.transform.k)
          draw()
          c.restore()
        }

        d3.select(c.canvas).call(
          d3
            .zoom()
            .scaleExtent([1 / 16, 4])
            .on('zoom', zoomed)
        )

        draw()

        c.canvas.style = 'cursor: move'

        return c.canvas
      }
    )
  main.variable(observer()).define(['md'], function (md) {
    return md`
Canvas Tree Version modified from [@tmcw/octree-color-quantization](https://observablehq.com/@tmcw/octree-color-quantization)`
  })
  main
    .variable(observer('BinarySearchTree'))
    .define('BinarySearchTree', ['Node'], function (Node) {
      return class BinarySearchTree {
        constructor() {
          this.root = null
          this.path = []
        }

        insert(value) {
          var newNode = new Node(value)

          if (this.root === null) {
            this.root = newNode
          } else {
            this.insertNode(this.root, newNode)
          }
        }

        insertNode(node, newNode) {
          if (newNode.value < node.value) {
            if (node.left === null) {
              node.left = newNode
            } else {
              this.insertNode(node.left, newNode)
            }
          } else {
            if (node.right === null) {
              node.right = newNode
            } else {
              this.insertNode(node.right, newNode)
            }
          }
        }

        remove(value) {
          this.root = this.removeNode(this.root, value)
        }

        removeNode(node, key) {
          if (node === null) {
            return null
          } else if (key < node.value) {
            node.left = this.removeNode(node.left, key)
            return node
          } else if (key > node.value) {
            node.right = this.removeNode(node.right, key)
            return node
          } else {
            if (node.left === null && node.right === null) {
              node = null
              return node
            }
            if (node.left === null) {
              node = node.right
              return node
            } else if (node.right === null) {
              node = node.left
              return node
            }
            var aux = this.findMinNode(node.right)
            node.value = aux.value
            node.right = this.removeNode(node.right, aux.value)
            return node
          }
        }

        findMinMode(node) {
          if (node.left === null) {
            return node
          } else {
            return this.findMinNode(node.left)
          }
        }

        getRootNode() {
          return this.root
        }

        inorder(node) {
          if (node !== null) {
            this.inorder(node.left)
            console.log(node.value)
            this.inorder(node.right)
          }
        }

        search(node, value, initial = false) {
          if (initial) {
            this.path = []
          }
          if (node === null) {
            return null
          } else if (value < node.value) {
            this.path.push(node.value)
            return this.search(node.left, value)
          } else if (value > node.value) {
            this.path.push(node.value)
            return this.search(node.right, value)
          } else {
            this.path.push(node.value)
            return node
          }
        }

        getPath() {
          return this.path
        }

        getSearchPath(value) {
          this.search(this.root, value, true)
          return this.getPath()
        }
      }
    })
  main.variable(observer('Node')).define('Node', function () {
    return class Node {
      constructor(value) {
        this.value = value
        this.left = null
        this.right = null
      }
    }
  })
  main.variable(observer('length')).define('length', function () {
    return (d) => {
      return Math.sqrt(
        Math.pow(d.parent.x - d.x, 2) + Math.pow(d.parent.y - d.y, 2)
      )
    }
  })
  main.variable(observer('binarySearch')).define('binarySearch', function () {
    return (arr, target) => {
      let left = 0
      let right = arr.length - 1
      while (left <= right) {
        const mid = left + Math.floor((right - left) / 2)
        if (arr[mid] === target) {
          return mid
        }
        if (arr[mid] < target) {
          left = mid + 1
        } else {
          right = mid - 1
        }
      }
      return -1
    }
  })
  const child1 = runtime.module(define1)
  main.import('number', child1)
  main.import('button', child1)
  main.variable(observer('d3')).define('d3', ['require'], function (require) {
    return require('d3@5')
  })
  main.define('initial recurs1', function () {
    return 0
  })
  main
    .variable(observer('mutable recurs1'))
    .define(
      'mutable recurs1',
      ['Mutable', 'initial recurs1'],
      (M, _) => new M(_)
    )
  main
    .variable(observer('recurs1'))
    .define('recurs1', ['mutable recurs1'], (_) => _.generator)
  main.define('initial recurs2', function () {
    return 0
  })
  main
    .variable(observer('mutable recurs2'))
    .define(
      'mutable recurs2',
      ['Mutable', 'initial recurs2'],
      (M, _) => new M(_)
    )
  main
    .variable(observer('recurs2'))
    .define('recurs2', ['mutable recurs2'], (_) => _.generator)
  main.define('initial recurs3', function () {
    return 0
  })
  main
    .variable(observer('mutable recurs3'))
    .define(
      'mutable recurs3',
      ['Mutable', 'initial recurs3'],
      (M, _) => new M(_)
    )
  main
    .variable(observer('recurs3'))
    .define('recurs3', ['mutable recurs3'], (_) => _.generator)
  return main
}
