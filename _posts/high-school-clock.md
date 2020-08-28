---
type: 'visualization'
title: 'High School Clock'
excerpt: 'We all stared at the clock, waiting for 2:30 while class dragged on. This D3 visualization captures the iconic image, not to mention the fact it keeps good time as well.'
coverImage: '/assets/blog/high-school-clock/cover.jpg'
date: '2019-11-18'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

The High School Clock design is based on a photo I found after Googling `high school clock`, oddly enough. While most clocks of this ilk generally look alike, I was intrigued by the small details of the clock hand shapes.

I built the project with [D3](https://d3js.org/), a JavaScript data visualization library. The coolest thing is that this clock actually keeps accurate time by using `setInterval` and the native `Date` object. I update the position of the hands every second and use different animations to achive a realistic look.

<img src="/assets/blog/high-school-clock/original-clock.jpg" alt="Original High School Clock" />

The hour hand is basic, a simple rectangle.

The minute hand is tapered, a bit more modern looking.

The second hand is mainly thin, with an interesting trapeziod balancing feature.

The implementation of these hands uses SVG Polygon elements. To code each hand a function my output a set of points mathematically related to each other. The `radius` of the clock and various contacts are used to maintain proportion.

**Hour Hand**

```js
function hourHand() {
  var w = radius / 30
  var b = radius / 7.5
  var t = radius / 2.1
  return `${-w},${b} ${w},${b} ${w},${-t} ${-w},${-t} ${-w},${b}`
}
```

Check out the [source code](https://observablehq.com/@benjaminadk/high-school-clock) at Observable.
