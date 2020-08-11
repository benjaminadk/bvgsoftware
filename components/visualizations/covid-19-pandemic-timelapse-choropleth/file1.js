// https://observablehq.com/@benjaminadk/pandemic-timelapse@345
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Pandemic Timelapse`
)});
  main.variable(observer("currentDate")).define("currentDate", ["md","formatTime","d1"], function(md,formatTime,d1){return(
md` ## ${formatTime(new Date(d1))}`
)});
  main.variable(observer("totalCases")).define("totalCases", ["md","data2","formatTime","d1"], function(md,data2,formatTime,d1){return(
md` ## Total Cases ${data2[formatTime(new Date(d1))]}`
)});
  main.variable(observer("viewof button1")).define("viewof button1", ["html","mutable y","mutable d1"], function(html,$0,$1){return(
html`<form>${Object.assign(html`<button type=button>Run`, {onclick: event => {
  $0.value = true
  $1.value = 1580601600000
  event.currentTarget.dispatchEvent(new CustomEvent("input", {bubbles: true}))
}})}`
)});
  main.variable(observer("button1")).define("button1", ["Generators", "viewof button1"], (G, _) => G.input(_));
  main.variable(observer("viewof button2")).define("viewof button2", ["html","mutable y","mutable d1"], function(html,$0,$1){return(
html`<form>${Object.assign(html`<button type=button>Reset`, {onclick: event => {
  $0.value = false
  $1.value = 1580601600000
  event.currentTarget.dispatchEvent(new CustomEvent("input", {bubbles: true}))
}})}`
)});
  main.variable(observer("button2")).define("button2", ["Generators", "viewof button2"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","topojson","us","data","formatTime","d1","color","states"], function(d3,topojson,us,data,formatTime,d1,color,states)
{
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
);
  main.variable(observer("loop")).define("loop", ["button1","y","d1","day","mutable y","mutable d1"], async function*(button1,y,d1,day,$0,$1)
{
  button1;
  while(y) {
    await new Promise((resolve, reject) => {
      setTimeout(resolve,10)
    })
    var x = new Date(d1).getTime();
    x += day;
    if(x >= 1596240000000) {
      $0.value = false
      break
    }
    $1.value = x;
    yield;
  }
}
);
  main.define("initial y", function(){return(
false
)});
  main.variable(observer("mutable y")).define("mutable y", ["Mutable", "initial y"], (M, _) => new M(_));
  main.variable(observer("y")).define("y", ["mutable y"], _ => _.generator);
  main.define("initial d1", function(){return(
1580601600000
)});
  main.variable(observer("mutable d1")).define("mutable d1", ["Mutable", "initial d1"], (M, _) => new M(_));
  main.variable(observer("d1")).define("d1", ["mutable d1"], _ => _.generator);
  main.variable(observer("format")).define("format", function(){return(
d => `${d}`
)});
  main.variable(observer("formatTime")).define("formatTime", ["d3"], function(d3){return(
d3.timeFormat('%-m/%-d/%Y')
)});
  main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
d3.timeFormat('%Y-%m-%d')
)});
  main.variable(observer("day")).define("day", function(){return(
1000 * 60 * 60 * 24
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleQuantize([0, 1000], d3.schemeOranges[6])
)});
  main.variable(observer("data")).define("data", ["d3"], async function(d3)
{
  const url = 'https://gist.githubusercontent.com/benjaminadk/c3e14a2658e5babbf81d24163fb63d93/raw/b52c5b044581d3d5312808ea116ab0e4a3f1bb55/covid-timeline.csv'
  
  const raw = await d3.csv(url)
  return Object.assign(new Map(raw.map(({fips,state,county,...rest}) => [fips.length === 4 ? '0' + fips : fips, rest])), {title: 'Covid 19 Cases'})
}
);
  main.variable(observer("data2")).define("data2", ["d3"], async function(d3)
{
  const url = 'https://gist.githubusercontent.com/benjaminadk/7d18f4e0cd33e959868bc706aa41999b/raw/da2c5bb5609d515c2ebe028fb633162c782ab869/total-cases-by-date.csv'
  
  const raw = await d3.csv(url)
  return raw[0]
}
);
  main.variable(observer("states")).define("states", ["us"], function(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)});
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  return main;
}
