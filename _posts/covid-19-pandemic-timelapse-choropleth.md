---
type: 'visualization'
title: 'Covid 19 Pandemic Timelapse Choropleth'
excerpt: 'A step by step tutorial on creating a choropleth map to display county level Covid 19 case data. Learn how to harness JavaScript and D3 to create powerful visualizations.'
coverImage: '/assets/blog/covid-19-pandemic-timelapse-choropleth/cover.jpg'
date: '2020-08-05'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

### Code Along With This Article

If you plan to code along and create your own map, use my original [Source Code](https://observablehq.com/@benjaminadk/pandemic-timelapse) as a point of reference.

## How To Build A Timelapse Choropleth

### Finding Data

The first step in creating any visualization is finding the data. Previously published visualizations will often provide links to public data. I have also had good luck searching [GitHub](https://github.com/) for open source data. This is where I was able to find the data for this article.

One important data property to look for is the presence of a Federal Information Processing Standard, or [FIPS Code](https://en.wikipedia.org/wiki/FIPS_county_code). This code identifies counties (or their equivilants) in the United States, and is how we associate the statistics to our visualization.

**Data Source For This Article**

[Covid 19 Cases By County CSV](https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv)

The above source can be used directly, but I prefer to download the raw data, clean up the data to better suit my current project, and then republish the data so my visualization will not be affected by someone else editting or removing the source data it relies on.

### Publishing Data

After downloading the data CSV above, I opened it with Excel on my local machine to make a few changes. Once I was happy with it, I closed Excel and then opened the file with Note Pad. Then it is a simple copy and paste from there to a new Gist.

I simplified the date by removing fields I did not need.

Here is my [Public Gist](https://gist.github.com/benjaminadk/39eee36444a8a30e3fa583c3e0b8aefb) with case count for each county by day.

Here is my [Public Gist](https://gist.githubusercontent.com/benjaminadk/7d18f4e0cd33e959868bc706aa41999b/raw/da2c5bb5609d515c2ebe028fb633162c782ab869/total-cases-by-date.csv) with total US cases by day.

### Observable Notebooks

We will be using [Observable](https://observablehq.com/) to build our visualization. Observable was created by the same people that created [D3](https://d3js.org/), and is sort of a marriage between blogging and JavaScript programming. Programmers can create visualizations and text in the browswer and share a link to their work. The platform has its own runtime and I have used it to embed parts of my notebook directly into this NextJS blog.

Observable is based on JavaScript, but it has its own features on top of standard JS. This article won't get into every aspect, but will attempt to point out relevant details.

Observable allows us to create Cells, or chunks of code which can be used to import dependencies, declare global variables, import data, render visualizations or display text based on HTML or Markdown.

Check out Observable creator [Mike Bostock's notebooks](https://observablehq.com/@mbostock), which provide more insight into the platform.

Any users notebooks can be found via in-site search or by appending `@username` to the root domain. Mine are at [@benjaminadk](https://observablehq.com/@benjaminadk).

### Tutorial

This section will share and explain my code, cell by cell, directly from my original source code. We will be working from the bottom of my notebook to the top. The order of cells is arbitrary, but for readability it is commonplace to declare data and dependencies at the bottom and show text and visualizations above.

The end product will be what I call the Pandemic Timelapse Choropleth. That is an animated map of sorts, that shows the day by day progression of Covid 19 on a county by county basis. This project covers 2/1/2020 - 8/1/2020, or 6 months of the Covid 19 pandemic.

### What is a Choropleth

A [Choropleth Map](https://en.wikipedia.org/wiki/Choropleth_map) is a map that uses shading to represent statistical data. They are very intuitive and easy for most people to understand.

The D3 ecosystem provides many of the tools needed to create a county level map visualization of the US.

### Cell 1

Import version 5 of [D3](https://d3js.org/). This will be available globally as `d3`. We don't need to use a keyword like `var, const, or let` since we are defining the entire cell. This might seem odd at first, but is how Observable works.

```js
d3 = require('d3@5')
```

### Cell 2

Helps manipulate TopoJSON. Needed for maps like this.

```js
topojson = require('topojson-client@3')
```

### Cell 3

JSON data for the geography of the US.

```js
us = d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json')
```

### Cell 4

Create a JavaScript Map with the key `id` and value of `properties`. The `id` corresponds to a FIPS code, and the `value` contains

```js
states = new Map(us.objects.states.geometries.map((d) => [d.id, d.properties]))
```

### Cell 5

CSV data showing the total number of Covid 19 cases by date. This is used soley for the covid count. While this could be derived from our main data, it is simpler to just have separate source. Returns a JavaScript object so we can simply lookup the date as a key and get the cases as the value.

```js
data2 = {
  const url = 'https://gist.githubusercontent.com/benjaminadk/7d18f4e0cd33e959868bc706aa41999b/raw/da2c5bb5609d515c2ebe028fb633162c782ab869/total-cases-by-date.csv'

  const raw = await d3.csv(url)
  return raw[0]
}
```

### Cell 6

CSV data for each county in the US. This includes the accumulative case count for dates from 1/22 to 8/1, for each county. The FIPS code is the key and cases in the value.

```js
data = {
  const url = 'https://gist.githubusercontent.com/benjaminadk/c3e14a2658e5babbf81d24163fb63d93/raw/b52c5b044581d3d5312808ea116ab0e4a3f1bb55/covid-timeline.csv'

  const raw = await d3.csv(url)
  return Object.assign(new Map(raw.map(({fips,state,county,...rest}) => [fips.length === 4 ? '0' + fips : fips, rest])), {title: 'Covid 19 Cases'})
}
```

### Cell 7

A simple D3 color scale. The scheme is the scale of colors we will be using, in this case oranges. With `scaleQuantize` we define a range such that counties at 0 will be light and get darker as cases approach 1000. These values can be toggled to change the appearance and subtlty of the map.

```js
color = d3.scaleQuantize([0, 1000], d3.schemeOranges[6])
```

### Cell 8

Create a variable `day` that represents the number of milliseconds in a day. This is used to increment the timelapse one day at a time, amongst other utility.

```js
day = 1000 * 60 * 60 * 24
```

### Cell 9

Formats a date such that is can easily be fed into JavaScript's `new Date()` constructor.

```js
formatDate = d3.timeFormat('%Y-%m-%d')
```

### Cell 10

Formats a date such that it conforms to our datasets format of `month/day/year`.

```js
formatTime = d3.timeFormat('%-m/%-d/%Y')
```

### Cell 11

Establish a starting point of February 1, 2020 in milliseconds. The `mutable` keyword is specific to Observable and allows us to alter this value explicitly in another cell. The variable ultimately is fed to the visualization which will display the county case data for this date.

```js
mutable d1 = 1580601600000
```

### Cell 12

Another `mutable` variable that will be used as a flag to control a `while` loop.

```js
mutable y = false
```

### Cell 13

A `while` loop that is evaluated when `button1` is clicked. Runs while `y` is true. Each iteration is slightly delayed by having to wait for a `Promise` to resolve. The date is converted to milliseconds and the loop will stop if the `d1` is greater than `8/1/2020`. If less than `8/1/2020` the `d1` variable is increased by one day.

```js
loop = {
  button1;
  while(y) {
    await new Promise((resolve, reject) => {
      setTimeout(resolve,10)
    })
    var x = new Date(d1).getTime();
    x += day;
    if(x >= 1596240000000) {
      mutable y = false
      break
    }
    mutable d1 = x;
    yield;
  }
}
```

### Cell 14

The choropleth map is created with a standard D3 approach. We use `geoPath` with the `topojson` data to create polygons for each state and county, then use the FIPS number from the map data to lookup with cases. The current value of `d1`, our global date variable is used to retrieve the case data from that day. We also add a `title` to each county to display its name and case total when hovered. Finally, an extra stroke around each states helps bring more definition to the map. A `node` is returned, which lets Observable know we intend to show HTML.

Note we use the `color` and `formatTime` functions previoiusly defined in past cells. Observable will automatically update this cell whenever the mutable `d1` variable changes value. There is no additional code needed. How cool is that? While I could have just displayed a static map, I thought I would illustrate some of the more advanced (at least for me...) features of Observable. Honestly, this just scratches the surface of what can be done with this amazing technology.

```js
chart = {
  const path = d3.geoPath()

  const svg = d3.create("svg")
    .attr("viewBox", "0 0 960 600")
    .style("width", "100%")
    .style("height", "auto")

  svg.append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .join('path')
      .attr('fill', d =>  {
        var obj = data.get(d.id)
        var x = obj[formatTime(new Date(d1))]
        return color(x)
      })
      .attr('d', path)
      .append('title')
        .text(d => {
          var obj = data.get(d.id)
          var x = obj[formatTime(new Date(d1))]
          return `${d.properties.name} County, ${states.get(d.id.slice(0, 2)).name}
${x} Covid Cases`
      })

  svg.append('path')
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1)
    .attr('stroke-linejoin', 'round')
    .attr('d', path)

  return svg.node()
}
```

### Cell 15

We use the built in HTML template function to create a button with an onclick handler that resets the global values `y` and `d1` to their original values.

```js
viewof button2 = html`<form>${Object.assign(html`<button type=button>Reset`, {onclick: event => {
  mutable y = false
  mutable d1 = 1580601600000
  event.currentTarget.dispatchEvent(new CustomEvent("input", {bubbles: true}))
}})}`
```

### Cell 16

Very similar to the reset button but turns the `y` flag to `true` thus starting the while loop that powers the timelapse. Evaluating this button must also take place before the loop runs.

```js
viewof button1 = html`<form>${Object.assign(html`<button type=button>Run`, {onclick: event => {
  mutable y = true
  mutable d1 = 1580601600000
  event.currentTarget.dispatchEvent(new CustomEvent("input", {bubbles: true}))
}})}`
```

### Cell 17

Display the total number of cases in the US on any given date during the pandemic.

```js
totalCases = md` ## Total Cases ${data2[formatTime(new Date(d1))]}`
```

### Cell 18

Reflects the current date being displayed on the map.

```js
currentDate = md` ## ${formatTime(new Date(d1))}`
```
