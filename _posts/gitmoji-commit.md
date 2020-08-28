---
type: 'project'
title: 'Gitmoji Commit For VS Code'
excerpt: 'A VS Code extension for composing Git commit messages using emojis in addition to text. Gitmoji lends added context to a commit, making it more visually appealling and identifiable.'
coverImage: '/assets/blog/gitmoji-commit/cover.jpg'
date: '2019-09-01'
author:
  name: 'BVG Software'
  picture: '/assets/blog/authors/bvg.jpg'
video:
  description: 'Learn how to use the free VS Code extension Gitmoji Commit. This lightweight, yet robust, extension allows user to easily compose commit messages with meaningful emojis.'
  contentUrl: 'https://youtu.be/PKSmTijO8hs'
  duration: 'PT4M34S'
---

Gitmoji Commit is a free extension for [Visual Studio Code](https://code.visualstudio.com) that allows users to easily compose Git `commit` messages with emojis. The default emoji mapping is based on [Gitmoji](https://gitmoji.carloscuesta.me/) where each emoji is associated with a certain type of commit. A user can also supply their own emoji system via the settings in VS Code. The purpose of this system, as a whole, is to make commit messages easy to identify at a glance.

## Overview

A short video describing the extension in use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/PKSmTijO8hs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Inspiration

The genesis of Gitmoji Commit came about when I was working in a small team and the team leader wanted to use emojis in our commit messages. This didn't seem like a hassle until I found myself having to surf around and lookup the right emoji every time I made a commit. I searched for an extension in VS Code, and when I came back with nothing I decided it would be a good time to learn how to write my own. VS Code has done a great job documenting the steps required to [work with extensions](https://code.visualstudio.com/api/get-started/your-first-extension).

<img src='/assets/blog/gitmoji-commit/gitmojis.png' alt="Popular Emojis From Gitmoji" />

## Using Gitmoji Commit

Once the extension is installed it is easy to integrate into a normal workflow. When the time comes to make a commit open Gitmoji Commit through a keyboard shortcut or through the Command Palette. Since the keyboard shortcut needs to be setup manually lets walk through the Command Palette flow.

<img src='/assets/blog/gitmoji-commit/extension.gif' alt="Use Gitmoji Commit In Microsoft VS Code" />

1. Open the Command Palette with `Cmd/Ctl + Shift + P`
2. Search for `Gitmoji Commit: Commit Message` and click on it
3. A searchable list of emojis will appear
4. Select an emoji
5. A new text field will appear which accepts the actual text of the commit message
6. Type the commit text and press `Enter`
7. The entire commit message will appear in the terminal
8. Press enter or turn on `Auto Commit`

Check out the [Gitmoji Commit README](https://github.com/benjaminadk/emojigit) to learn about all the features.
