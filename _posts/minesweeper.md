---
type: 'visualization'
title: 'Minesweeper'
excerpt: 'Hello 1997! This visualization and source code celebrates the classic Windows game that lived in the shadow of Solitare for years and years. Enjoy if you can remember how to play.'
coverImage: '/assets/blog/minesweeper/cover.jpg'
date: '2019-07-18'
author:
  name: 'BVG Software'
  picture: '/assets/blog/authors/bvg.jpg'
---

## Rules Of The Game

Minesweeper is a game of mathematics, logic, and chance

1. Set a difficulty level - `Beginner`, `Intermediate`, or `Expert`
2. **Left Click** any cell on the board to begin
3. Visible numbers represent how many bombs are present in the 8 surrounding cells
4. **Right Click** any cell to plant a flag and designate cell as a bomb
5. The goal of each game session is to clear all cells without clicking a bomb

|    Level     | Bombs | Grid Size |
| :----------: | :---: | :-------: |
|   Beginner   |  10   |   9 x 9   |
| Intermediate |  40   |  16 x 16  |
|    Expert    |  99   |  16 x 30  |

## Notes

As part of a recent interview process I was sent a package of materials to study in advance. One of the suggested assignments was to create a command line version of [Minesweeper](https://en.wikipedia.org/wiki/Microsoft_Minesweeper). Minesweeper is a classic video game that first appeared on Windows 3.1 in 1992.

I decided it might be more interesting to build a graphic version since I had been exploring SVG and [D3](https://d3js.org) in recent weeks. After completing the project, I find myself with a new appreciation for the power of SVG in user interface design. Aside from the frame surrounding the game, which is a series of tiny GIFs, and the fonts used to represent numeric values, the entire user interface is composed of [SVG Patterns](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Patterns) I created with [Boxy Svg](https://boxy-svg.com/).

Check out the [source code](https://observablehq.com/@benjaminadk/minesweeper) at Observable
