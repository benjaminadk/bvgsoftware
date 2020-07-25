---
type: 'visualization'
title: 'Simple Binary Search Tree'
excerpt: 'Learn how a Binary Search Tree data structure can be used to dramatically accelerate a search function. Visualization powered by JavaScript and D3.'
coverImage: '/assets/blog/simple-binary-search-tree/cover.jpg'
date: '2019-12-22'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

## Binary Search Tree

This visualization is a [Binary Search Tree](https://en.wikipedia.org/wiki/Binary_search_tree) I built using JavaScript. As values are added to the Binary Search Tree new `nodes` are created. Each node has a `value`, as well as a `left` and a `right` property. The left and right properties are other nodes in the tree that are connected to the current node.

The only rule of the Binary Search Tree is that the left node's value must be less than or equal to the parent node's value and the right node's value must be greater than or equal to the parent's value. This rule makes finding a value more efficient than the linear search alternative. Imagine a linear search as an `array` being checking one value at a time sequencially.

## Big O Notation

Using [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation#:~:text=Big%20O%20notation%20is%20a,a%20particular%20value%20or%20infinity.), the time complexity of a linear search is `O(n)`, while the Binary Search Tree is `O(log n)`. Essentially, the worst case scenario for a linear search is that every item in the array must be visited. This means the search time increases at the same rate that the size of the array increases. On the other hand, as the size of a Binary Search Tree increases the search time levels off. Simply stated, the more stuff being searched through, the more beneficial a Binary Search Tree becomes.

## JavaScript Classes

Here are the JavaScript classes I used for this visualization

### Binary Search Tree

```js
class BinarySearchTree {
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
```

### Node

```js
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}
```

Check out the [source code](https://observablehq.com/@benjaminadk/simple-binary-search-tree) at Observable.
