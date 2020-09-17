---
type: 'post'
title: 'React Markdown Blog Read Time Feature'
excerpt: 'Learn how to add a read time feature to your React Markdown Blog. Implement the same logic used by some of the most popular publications on the internet. Look professional, even if you are not.'
coverImage: '/assets/blog/react-markdown-blog-read-time-feature/cover.jpg'
date: '2020-09-04'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

## Intro

I just added a new Read Time Feature to this blog. I started with a Google search:

> How many words can a person read per minute

I stumbled upon this [Medium Article](https://blog.medium.com/read-time-and-you-bc2048ab620c) which outlines the basics and describes how Medium engineers implemented a read time feature for their site.

They acknowledge that read time is just an estimate, one that does not take into consideration the ability of the reader or the complexity of the article's topic. Nevertheless, this feature has become widely adopted.

The following article will outline how I incorporated my own read time feature into this site - a [NextJS](https://nextjs.org/) and [Markdown](https://en.wikipedia.org/wiki/Markdown) powered blog.

## Site Structure

This blog uses Markdown files as the source material for blog content. A posts folder contains one file for each post. The site is built ahead of time by NextJS, which reads each file and transforms my Markdown into React elements. I will use simple JavaScript just before this transformation to calculate the read time for each post.

The name of each of my Markdown files becomes the slug for the webpage. The file responsible for this post is `react-markdown-blog-read-time-feature.md`. The following `getPostBySlug` function is called to read my Markdown files into memory.

<div class='filename'>lib/api.js</div>

```js
import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import getReadTime from './read-time'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const readTime = getReadTime(content)

  const items = {}

  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (field === 'readTime') {
      items[field] = readTime
    }

    if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}
```

For those interested in creating a blog like this one, I recommend the [Gray Matter](https://github.com/jonschlinkert/gray-matter) library. It allows me to add `yml` data to the top of a Markdown file to attach extra metadata, while also separating the `content` of the file. This `content` is simply the raw text of my post. It is this raw text that I will pass to my `readTime` function.

I can then pass on the results of the read time feature as part of the blog post object, making it simple to compose into my blog page later.

## Markdown Content

For those unfamiliar with Markdown, the following is a small excerpt from my post titled [How To Build A Color Picker](https://bvgsoftware.com/posts/how-to-build-a-color-picker).

```md
## Hue

This color picker can incorporate various color formats but for now [HSL](https://en.wikipedia.org/wiki/HSLandHSV), or hue, saturation, lightness will be used. In my opinion, HSL lends itself to user input in a more intuitive way than other color formats. The Hue component is a rectangular bar displaying the full range of color hues, from 0 to 360.

<img src='/assets/blog/how-to-build-a-color-picker/color-picker-1.png' alt="Color Picker" />
```

I am using HTML image tags instead of the Markdown shorthand.

The rest of the text is largely just text, with the occasional `#` and other Markdown symbols.

## Read Time Function

The end goal, or output, of the read time function is the number of minutes it will take to read the post.

I am using the average reader's words per minute (WPM) found in the Medium article I cited earlier. This value is 275, which I divide by 60, since we need to account for images using the seconds unit.

<div class="filename">lib/read-time.js</div>

```js
export default function readTime(content) {
  const WPS = 275 / 60

  var images = 0
  const regex = /\w/

  let words = content.split(' ').filter((word) => {
    if (word.includes('<img')) {
      images += 1
    }
    return regex.test(word)
  }).length

  var imageAdjust = images * 4
  var imageSecs = 0
  var imageFactor = 12

  while (images) {
    imageSecs += imageFactor
    if (imageFactor > 3) {
      imageFactor -= 1
    }
    images -= 1
  }

  const minutes = Math.ceil(((words - imageAdjust) / WPS + imageSecs) / 60)

  return minutes
}
```

My basic approach was to split the raw text on each space and then filter out anything that doesn't consist of letters or numbers. This prevents the Markdown syntax, spaces, and other non words from being counted. I accomplish this with JavaScript's built in [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) feature.

The character class `\w` represents `[a-zA-Z0-9_]`, and the `RegExp.prototype.test()` method is used to filter any string that does not contain an alphanumeric character.

While the filtering is happening, I also count the `img` HTML tags. This allows for the proceeding `while` loop that adds up `imageSecs`, or the number of extra seconds estimated to view images based on the aforementioned logic. I also subtract 5 words for each image to account for the `src`, `alt`, and `img` tag itself.

Finally, everything comes together to solve for `minutes`. This is the estimated read time which is attached to the post object and displayed at the top of each post.

## Conclusion

While not perfect, I do feel this formula provides a useful estimate and is a relatively simple implementation. Moreover, knowing how much time commitment an article will require is useful.
