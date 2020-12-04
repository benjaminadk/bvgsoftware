---
type: post
title: 'How To Create GIFs With NodeJS'
excerpt: 'When you want to convey as message, but an image is too simplistic and a video is too complex, a GIF can be the perfect middle ground. Learn how to create your own GIFs with NodeJS.'
coverImage: '/assets/blog/how-to-create-gifs-with-node-js/cover.jpg'
date: '2019-08-24'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

## Introduction

When you want to convey as message, but an image is too simplistic and a video is too complex, a GIF can be the perfect middle ground. As a JavaScript developer, I wondered...

- Could GIFs be created with JavaScript?
- If yes, could I write a program accomplish that task?

After a little research, and a lot of trial and error, I found the answer to both question was yes. This article sums up what I found.

<img src='/assets/blog/how-to-create-gifs-with-node-js/rick-james.gif' alt="Rick James GIF" />

## The GIF Format

A good starting point is to research the history of the GIF format. It turns out the Graphics Interchange Format was originally created by CompuServe back in the 1980s and was one of the first image formats used on the web. While the PNG format has pretty much replaced GIF for single images, GIF's ability to animate a series of images keeps the format relevant and supported today.

In GIFs as we know them today, each image is allowed a maximum palette size of 256 colors. This limitation is why GIF is more suited to illustrations than photography, even though it is used for both. GIF images are compressed using the LZW algorithm, which provides lossless data compression. For more general information, [Wikipedia](https://en.wikipedia.org/wiki/GIF) is a great source, and for an in-depth breakdown of the entire specification, check out [What's In a GIF](http://giflib.sourceforge.net/whatsinagif/index.html).

## My Use Case

I have been playing around with [Electron](https://electronjs.org/) a lot lately and I decided to attempt a desktop application that could record the user's screen and then turn the captured images into a GIF. The Electron environment combines the features of the browser, the the features of [Node](https://nodejs.org/en/), and Electron's own APIs. Electron's `desktopCapturer` API makes capturing the user's screen a frame at a time and then saving those images to disk possible. Having these sequencial images is essential to this approach to GIF encoding.

My article [GifIt](https://benjaminbrooke.me/projects/gifit/) goes into more detail on that subject, and the [Source Code](https://github.com/benjaminadk/gifit/tree/master/src/renderer/components/Recorder) is available if you want to check out how I went about recording the desktop. At this point, my goal became to write my own library for GIF encoding.

## Existing Libraries

The next step I took was to look into existing libraries on [NPM](https://www.npmjs.com/) and [Github](https://github.com/). There are a few options, and which one you use depends a lot of your use case and the available documentation. It looks like the original implementation in JavaScript was [gif.js](https://github.com/jnordberg/gif.js). I poked around the files and was happy to find that the `LZWEncoder` and `NeuQuant` algorithms had already been ported to JavaScript. I used these as building blocks for my library.

## My GIF Library

One thing I noticed about existing libraries was that GIFs took a long time to process and the size of the output files seemed really large. [GIF Encoder 2](https://github.com/benjaminadk/gif-encoder-2) adds new features to help mitigate these downsides.

The first thing I did was add an optional optimizer. I discoved that a lot of time was being spent reducing an image into its 256 color palette. This process involves looking at the color of every pixel in an image and was being done by the NeuQuant algoritm. I added the ability to reuse the palette from the previous image if the current and previous image are similar. Checking this adds a small amount of overhead, but not nearly as much overhead as calculating a new color palette.

I also added a second algorithm called Octree that uses a totally different method to calculate the color palette. This ended up resulting in smaller smaller file sizes.

## Using Gif Encoder 2

```bash
npm install gif-encoder-2
```

### Constructor

`GIFEncoder(width, height, algorithm, useOptimizer, totalFrames)`

|   Parameter    |  Type   |          Description           | Required |  Default   |
| :------------: | :-----: | :----------------------------: | :------: | :--------: |
|    `width`     | number  | the width of images in pixels  |   yes    |    n/a     |
|    `height`    | number  | the height of images in pixels |   yes    |    n/a     |
|  `algorithm`   | string  |     `neuquant` or `octree`     |    no    | `neuquant` |
| `useOptimizer` | boolean |   enables/disables optimizer   |    no    |   false    |
| `totalFrames`  | number  |     total number of images     |    no    |     0      |

The constructor requires 2 arguments, but can accept up to 5.

<div class="filename">constructor.js</div>

```js
const encoder = new GIFEncoder(500, 500)
const encoder = new GIFEncoder(1200, 800, 'octree', false)
const encoder = new GIFEncoder(720, 480, 'neuquant', true, 20)
```

### Methods

|        Method        |    Parameter     |               Description               |
| :------------------: | :--------------: | :-------------------------------------: |
|       `start`        |       n/a        |           Starts the encoder            |
|      `addFrame`      | `Canvas Context` |         Adds a frame to the GIF         |
|      `setDelay`      |     `number`     | Number of milliseconds to display frame |
| `setFramesPerSecond` |     `number`     | Number of frames per second to display  |
|     `setQuality`     |  `number 1-30`   |            Neuquant quality             |
|    `setThreshold`    |  `number 0-100`  |     Optimizer threshold percentage      |
|     `setRepeat`      |  `number >= 0`   |        Number of loops GIF does         |
|       `finish`       |       n/a        |            Stops the encoder            |

### Basic Example

This example creates a simple GIF and shows the basic way Gif Encoder 2 works.

1. Create an instance of `GIFEncoder`
2. Call any needed `set` methods
3. Start the encoder
4. Add frames as Canvas `context`
5. Get the output data and do something with it

```js
const GIFEncoder = require('gif-encoder-2')
const { createCanvas } = require('canvas')
const { writeFile } = require('fs')
const path = require('path')

const size = 200
const half = size / 2

const canvas = createCanvas(size, size)
const ctx = canvas.getContext('2d')

function drawBackground() {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
}

const encoder = new GIFEncoder(size, size)
encoder.setDelay(500)
encoder.start()

drawBackground()
ctx.fillStyle = '#ff0000'
ctx.fillRect(0, 0, half, half)
encoder.addFrame(ctx)

drawBackground()
ctx.fillStyle = '#00ff00'
ctx.fillRect(half, 0, half, half)
encoder.addFrame(ctx)

drawBackground()
ctx.fillStyle = '#0000ff'
ctx.fillRect(half, half, half, half)
encoder.addFrame(ctx)

drawBackground()
ctx.fillStyle = '#ffff00'
ctx.fillRect(0, half, half, half)
encoder.addFrame(ctx)

encoder.finish()

const buffer = encoder.out.getData()

writeFile(path.join(__dirname, 'output', 'beginner.gif'), buffer, (error) => {
  // gif drawn or error
})
```

<img src='/assets/blog/how-to-create-gifs-with-node-js/beginner.gif' alt="Beginner GIF" />

### Advanced Example

This example creates a reusable function that reads a directory of image files and turns them into a GIF. The encoder itself isn't as complicated as the surrounding code.

This logic is a simplified version of my GIF recording application.

Note that `setDelay` can be called once (sets all frames to the value passed in) or once per frame (sets delay value for that frame).

**Code Walkthrough**

1. Read a directory of images (gets the path to each image)
2. Create an `Image` to find the dimensions
3. Create a write `stream` to an output `gif` file
4. Create an instance of the `GIFEncoder`
5. Pipe the encoder's read `stream` to the write `stream`
6. Call any needed `set` methods
7. Start the encoder
8. Draw each image to a Canvas
9. Add each `context` to encoder with `addFrame`
10. When GIF is done processing `resolve1()` is called and function is done
11. Use this function to compare the output of both NeuQuant and Octree algorithms

```js
const GIFEncoder = require('gif-encoder-2')
const { createCanvas, Image } = require('canvas')
const { createWriteStream, readdir } = require('fs')
const { promisify } = require('util')
const path = require('path')

const readdirAsync = promisify(readdir)
const imagesFolder = path.join(__dirname, 'input')

async function createGif(algorithm) {
  return new Promise(async (resolve1) => {
    const files = await readdirAsync(imagesFolder)

    const [width, height] = await new Promise((resolve2) => {
      const image = new Image()
      image.onload = () => resolve2([image.width, image.height])
      image.src = path.join(imagesFolder, files[0])
    })

    const dstPath = path.join(__dirname, 'output', `${algorithm}.gif`)

    const writeStream = createWriteStream(dstPath)

    writeStream.on('close', () => {
      resolve1()
    })

    const encoder = new GIFEncoder(width, height, algorithm)

    encoder.createReadStream().pipe(writeStream)
    encoder.start()
    encoder.setDelay(200)

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    for (const file of files) {
      await new Promise((resolve3) => {
        const image = new Image()
        image.onload = () => {
          ctx.drawImage(image, 0, 0)
          encoder.addFrame(ctx)
          resolve3()
        }
        image.src = path.join(imagesFolder, file)
      })
    }
  })
}
```

Create GIFs by passing in the name of the algorithm

```js
createGif('neuquant')
createGif('octree')
```

<img src='/assets/blog/how-to-create-gifs-with-node-js/neuquant.gif' alt="Neuquant Algoritm" />

<img src='/assets/blog/how-to-create-gifs-with-node-js/octree.gif' alt="Octree Algoritm" />

## Alternative Encoding Method

While Gif Encoder 2 is reliable and can encode GIFs faster than other existing libraries, I did find one alternative that works better. This method requires the [FFmpeg](https://ffmpeg.org/) stream processing library to be installed on the host machine. FFmpeg is a command line tool, but can be executed by Node using the `childprocess` API.

When I was creating GifIt I added the ability to adjust the duration of each frame in the GIF. Imagine a user wants to display a title page for 5 seconds before running through the rest of the frames or wants to cut the duration of certain frames by half. In order to accomadate these variable durations FFmpeg requires a text file describing the path and duration of each image. The duration is in seconds and the paths are relative.

Example from [FFmpeg Docs](https://trac.ffmpeg.org/wiki/Slideshow)

```bash
file '/path/to/dog.png'
duration 5
file '/path/to/cat.png'
duration 1
file '/path/to/rat.png'
duration 3
file '/path/to/tapeworm.png'
duration 2
file '/path/to/tapeworm.png'
```

The following is a simplifed version of the function I used in GifIt.

- `images` is an array of frame objects with absolute path and duration properties
- `dstPath` is the destination to save the output GIF file
- `cwd` is the absolute path of the current working directory
- `ffmpegPath` is the absolute path to the FFmpeg executable on my host machine
- the path to the last image is added twice as required by FFmpeg

```js
import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export const createGif = async (images, dstPath, cwd, ffmpegPath) => {
  return new Promise((resolve) => {
    let str = ''
    images.forEach((image, i) => {
      str += `file ${path.basename(image.path)}\n`
      str += `duration ${image.duration}\n`
    })
    str += `file ${path.basename(images[images.length - 1].path)}`
    const txtPath = path.join(cwd, 'template.txt')
    writeFile(txtPath, str).then(() => {
      execFile(
        ffmpegPath,
        [
          '-f',
          'concat',
          '-i',
          'template.txt',
          '-lavfi',
          'palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle',
          dstPath
        ],
        { cwd },
        (error, stdout, stderr) => {
          if (error) {
            throw error
          } else {
            resolve()
          }
        }
      )
    })
  })
}
```

Contact us if you have any questions
