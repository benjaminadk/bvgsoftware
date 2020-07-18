import React from 'react'
import unified from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import refractor from 'refractor/core'
import raw from 'rehype-raw'
import visit from 'unist-util-visit'
import nodeToString from 'hast-util-to-string'
import autohotkey from 'refractor/lang/autohotkey'
import bash from 'refractor/lang/bash'
import jsx from 'refractor/lang/jsx'
import javascript from 'refractor/lang/javascript'
import css from 'refractor/lang/css'
import cssExtras from 'refractor/lang/css-extras'
import jsExtras from 'refractor/lang/js-extras'
import markdown from 'refractor/lang/markdown'
import json from 'refractor/lang/json'

// Register only what is needed
refractor.register(autohotkey)
refractor.register(bash)
refractor.register(jsx)
refractor.register(json)
refractor.register(javascript)
refractor.register(jsExtras)
refractor.register(css)
refractor.register(cssExtras)
refractor.register(markdown)

// jsx just extends javascript
refractor.alias({ jsx: ['js'] })

const getLanguage = (node) => {
  const className = node.properties.className || []

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }

  return null
}

const rehypePrism = (options) => {
  options = options || {}

  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (node.tagName === 'a') {
      console.log(node)
    }

    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return
    }

    const lang = getLanguage(node)

    if (lang === null) {
      return
    }

    let result
    try {
      parent.properties.className = (parent.properties.className || []).concat(
        'language-' + lang
      )
      result = refractor.highlight(nodeToString(node), lang)
    } catch (err) {
      if (options.ignoreMissing && /Unknown language/.test(err.message)) {
        return
      }
      throw err
    }

    node.children = result
  }
}

const processor = unified()
  .use(parse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(raw)
  .use(rehypePrism)
  .use(rehype2react, {
    createElement: React.createElement
  })

const Markdown = ({ source, className }) => {
  const res = processor.processSync(source)

  return <div className={className}>{res.result}</div>
}

export default Markdown
