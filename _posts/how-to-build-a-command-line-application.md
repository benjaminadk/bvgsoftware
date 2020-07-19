---
type: 'post'
title: 'How To Build A Command Line Application'
excerpt: 'JavaScript can be used for more than just manipulating the DOM in the browser. NodeJS can be used to build powerful command line applications. This article walks through a beginner level project.'
coverImage: '/assets/blog/how-to-build-a-command-line-application/cover.jpg'
date: '2020-01-25T05:35:07.322Z'
author:
  name: 'BVG Software'
  picture: '/assets/blog/authors/bvg.jpg'
video:
  description: 'Watch our command line application, built with JavaScript and Node, work in the real world. This video shows how to use the command itself and the various options to create thumbnail images.'
  thumbnailUrl: '/assets/blog/how-to-build-a-command-line-application'
  contentUrl: 'https://youtu.be/Mjzr1jwlaCQ'
  duration: 'PT3M54S'
---

JavaScript can be used for more than just manipulating the DOM in the browser. NodeJS can be used to build powerful command line applications. Over recent months I have developed my own CLI to speed up repetitive tasks at work. The project we build in this article is a small portion of that larger application and will do a lot more than output "Hello World" to your console.

## Overview

Short video explaining the project and showing it in action

<iframe width="560" height="315" src="https://www.youtube.com/embed/Mjzr1jwlaCQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Getting Started

[Project Source Code](https://github.com/benjaminadk/node-cli-tutorial)

[Download NodeJS](https://nodejs.org/en/) if you don't already have it installed locally.

After installation, the `node` command should be in your `PATH`. This means you now have access to the `node` command in your terminal.

Print the version of NodeJS currently installed on your local machine.

```bash
node -v
```

### Option 1 - Clone Source Code

Download the ZIP file or, better yet, clone the source code repository to your local machine.

```bash
git clone https://github.com/benjaminadk/node-cli-tutorial.git
```

### Option 2 - Build From Scratch

If you want to code along with me and build from scratch just continue reading. When I follow tutorials I usually have this approach.

Create a folder for the project.

```bash
mkdir node-cli
cd node-cli
```

Initialize this folder as an NPM project and create a file to start writing code in. [Node Package Manager](https://www.npmjs.com/).

```bash
npm init -y
touch index.js
```

If any of the instructions above were unfamiliar, or didn't work, you may want to do some googling to learn more about Node, NPM, Bash and the command line in general.

<img src="/assets/blog/how-to-build-a-command-line-application/command-line-app.gif" alt="Bash commands to initialize project and file structures" />

I suppose now would be a good time to let everyone know what this application is actually going to do.

We are going to make thumbnail images! More specifically, we will be able to navigate to a directory of full sized images and invoke our command. This will create a new directory full of thumbnails with a size we determine. In this use case we will be making 225x190 pixel thumbnails from 800x800 textile images and saving them as 40% quality JPEGs. We will use a library named [Jimp](https://github.com/oliver-moran/jimp) for image manipulation as well as [Commander](https://github.com/tj/commander.js) and [rimraf](https://github.com/isaacs/rimraf). Commander is a framework for command line application and rimraf is a file system utility.

Make sure you are in the project directory aka the same level as `package.json` when running the following command.

```bash
npm install jimp commander rimraf
```

To make sure everything is working correctly, add a little code to `index.js`.

<div class='filename'>index.js</div>

```javascript
console.log('Hello World')
```

And we're done!.

😎

Just kidding. This is just to make sure Node is working. I try to write tutorials that beginners can follow. From inside our `node-cli` directory we can now run our `index.js` file.

```bash
node ./index.js
```

Quick tip. `index.js` is recognized as a sort of default filename in Node. The following works as well.

```bash
node .
```

You should see `Hello World` output in the terminal.

The code above passes a relative filepath to the `node` command. Since the goal of this exercise is to make a command line tool, we need to make some modifications to be able to type a command anywhere on our computer and have our code execute.

First add the following line to the top of `index.js`. Understanding how this line works isn't important right now. It uses what is commonly called a Shebang `#!`.

<div class='filename'>index.js</div>

```javascript
#!/usr/bin/env node // highlight-line

console.log('Hello World')
```

The `package.json` file also needs to be updated. The important lines are highlighted. This `bin` key is telling NPM that when we type `make-thumbs` on the command line we want to run `index.js`. I named it `make-thumbs` just to avoid any conflicts with `node-cli`, but this name is arbitrary. That being said, commands usually have some relation to what they do. Common commands include `cd`, `ls`, `curl`, `mkdir`, to name a couple. It is important to understand that when these commands are entered there is code running somewhere behind the scenes.

<div class='filename'>package.json</div>

```javascript
{
  "name": "node-cli",
  "version": "1.0.0",
  "description": "Command line tutorial",
  "main": "index.js",
  "bin": {// highlight-line
    "make-thumbs": "./index.js" // highlight-line
  }, // highlight-line
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": {
    "name": "benjaminadk",
    "email": "benjaminadk@gmail.com",
    "url": "https://github.com/benjaminadk"
  },
  "license": "ISC",
  "dependencies": {
    "commander": "4.1.0",
    "jimp": "0.9.3"
  }
}
```

Now type `make-thumbs` in the command line. It should throw and error something like what you see below.

<img src="/assets/blog/how-to-build-a-command-line-application/command-line-app-1.png" alt="Command line output for make thumbs with error" >

There is one more step to wire the global command to work on our system. Make sure you are in the root of the project.

```bash
npm link
```

This should trigger the following output. NPM is working magic behind the scenes.

<img src="/assets/blog/how-to-build-a-command-line-application/command-line-app-2.png" alt="Command line output for npm link">

Try typing `make-thumbs` in the command line one more time.

<img src="/assets/blog/how-to-build-a-command-line-application/command-line-app-3.png" alt="Command line output for make thumbs now works" >

👍

Note that this link can be undone via `npm unlink`. On a Windows machine you can check `"~\AppData\Roaming\npm` to see that NPM has created a `.cmd` file corresponding to the command name. `~` refers to `C:\Users\your-user-name` aka the `HOME` directory. This information is not crucial but nice to know for a broader understanding.

Now this project is setup and we can add some useful code.

<div class='filename'>index.js</div>

```javascript
#!/usr/bin/env node

const program = require('commander')

program
  .version('1.0.0')
  .name('make-thumbs')
  .description('An image resizer to make thumbnails')
  .option('-s,--source [folder]', 'Source images directory', 'images')
  .option(
    '-d,--destination [folder]',
    'Directory to be created for thumbnails',
    'thumbnails'
  )
  .parse(process.argv)
```

Commander is a great framework which helps to set up options and produces help menus automatically. Here I am assigning a version, name and description, as well as some options. Finally, we are parsing `process.argv`. These are the arguments provided to the command. With just this code we already have a working command line tool.

```bash
make-thumbs --help
```

Output for our `help` command.

<img src="/assets/blog/how-to-build-a-command-line-application/command-line-app-4.png" alt="Command line output of make thumbs help command" >

The options allow us to input a path to a directory of source images and a path to the directory we want to save the new thumbnails in. These are relative to the current working directory and not absolute paths. Relative paths make sense because the nature of a command line application is that is portable. Relative paths are also shorter to type. These options will be passed into our underlying image manipulation logic.

I want to create a separate folder and file to hold some of this logic to keep things organized.

```bash
mkdir lib
cd lib
touch index.js
```

I want to take advantage of [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) code so I am using `promisify`. These utilities help to read directories, make directories, remove directories and check if directories exist. Consult the [Node File System API Documentation](https://nodejs.org/dist/latest-v12.x/docs/api/fs.html) for more information on these. I have also including the [Jimp](https://github.com/oliver-moran/jimp) logic to create a thumbnail to our specs.

<div class='filename'>lib/index.js</div>

```javascript
const jimp = require('jimp')
const rimraf = require('rimraf')

const fs = require('fs')
const { promisify } = require('util')

const thumbnail = async (src, dest) => {
  const image = await jimp.read(src)
  await image.resize(225, 190, jimp.RESIZE_BICUBIC)
  image.quality(40)
  await image.writeAsync(dest)
}

const directoryExists = (filepath) => {
  return fs.existsSync(filepath)
}

const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)
const rm = promisify(rimraf)

module.exports = {
  thumbnail,
  directoryExists,
  readdir,
  mkdir,
  rm
}
```

Here is the finished code for `index.js` with our utilities imported.

<div class='filename'>index.js</div>

```javascript
#!/usr/bin/env node

const program = require('commander')
const path = require('path')

const { thumbnail, directoryExists, readdir, mkdir, rm } = require('./lib')

program
  .version('1.0.0')
  .name('make-thumbs')
  .description('An image resizer to make thumbnails')
  .option('-s,--source [folder]', 'Source images directory', 'images')
  .option(
    '-d,--destination [folder]',
    'Directory to be created for thumbnails',
    'thumbnails'
  )
  .parse(process.argv)

const main = async () => {
  try {
    // Use current working dir vs __dirname where this code lives
    const cwd = process.cwd()

    // Use user input or default options
    const { source, destination } = program
    const srcPath = path.join(cwd, source)
    const destPath = path.join(cwd, destination)

    // Remove destination directory is it exists
    if (directoryExists(destPath)) {
      await rm(destPath)
    }

    // Create destination directory
    await mkdir(destPath)

    // Read source directory
    const imagesAll = await readdir(srcPath)

    // Create thumbnails
    for (let image of imagesAll) {
      const src = path.join(srcPath, image)
      const dest = path.join(destPath, image)
      console.log(`Creating thumbnail at: ${dest}`)
      thumbnail(src, dest)
    }

    console.log('Thumbnails created successfully!')
  } catch (error) {
    console.log('Error creating thumbnails.')
  }
}

main()
```

All of our logic is placed inside the `main` function which is executed at the bottom of the code. Within `main` there is a `try/catch` block. This is helpful in that we can handle errors and simplify error output. With this structure the message inside the `catch` block is all the user will see if there is an error. This can be customized to any message desired, including part or all of the actual error thrown. In development you can simply log the error here to troubleshoot.

One important aspect is the use of `process.cwd()`. This command line application works based on the directory level the user is located in, or the current working directory. This is used to create the paths to the source and destination folders. The destination folder is deleted and created again if it exists prior to command execution. Then the contents of the source directory are read into memory. Finally, these files are looped over and a thumbnail is created for each image and saved into the destination folder. I added some logs to give a sense of the program working. These can be removed or even replaced with some sort of progress logic. It is all up to you!

To make sure everything is working I have included a `test` directory in the source files. To test functionality do the following.

```bash
cd test
make-thumbs
```
