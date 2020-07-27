// https://observablehq.com/@benjaminadk/covid-19-deaths-by-age-group@198
export default function define(runtime, observer) {
  const main = runtime.module()
  main.variable(observer('title')).define('title', ['md'], function (md) {
    return md`
# The Impact Of Covid 19 In 2020`
  })
  main.variable(observer('subtitle')).define('subtitle', ['md'], function (md) {
    return md`
## Covid 19 Deaths By Age Group`
  })
  main.variable(observer('source')).define('source', ['md'], function (md) {
    return md`
### [Data Source: CDC Mortality Rates Through 7/18/20](https://www.cdc.gov/nchs/nvss/vsrr/covid_weekly/index.htm#AgeAndSex)`
  })
  main
    .variable(observer('chart1'))
    .define('chart1', ['simpleBarChart', 'data1'], function (
      simpleBarChart,
      data1
    ) {
      return simpleBarChart(
        data1,
        '#B22222',
        'tooltip-1',
        'Covid 19 Deaths By Age Group'
      )
    })
  main
    .variable(observer('chart2'))
    .define('chart2', ['simpleBarChart', 'data2'], function (
      simpleBarChart,
      data2
    ) {
      return simpleBarChart(
        data2,
        '#2170B0',
        'tooltip-2',
        'Deaths From Any Cause By Age Group'
      )
    })
  main
    .variable(observer('chart3'))
    .define('chart3', ['d3', 'data3'], function (d3, data3) {
      const width = 600
      const height = 400
      const margin = 50

      const colors = d3.scaleOrdinal(['covid', 'rest'], ['#B22222', '#2170B0'])
      const xScale = d3
        .scaleBand(
          data3.map((d) => d.group),
          [0, width]
        )
        .padding(0.4)
      const yScale = d3.scaleLinear(
        [0, d3.max(data3, (d) => d.covid + d.rest)],
        [height, 0]
      )

      const root = d3
        .create('svg')
        .attr('width', width + margin * 2)
        .attr('height', height + margin * 2)
        .attr('class', 'covid-chart')

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip tooltip-large')
        .style('opacity', 0)

      const svg = root
        .append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${margin}, ${margin})`)

      const stack = d3.stack().keys(['covid', 'rest'])
      const chartData = stack(data3)

      const groups = svg
        .append('g')
        .selectAll('g')
        .data(chartData)
        .join('g')
        .style('fill', (d, i) => colors(d.key))

      groups
        .selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('x', (d) => xScale(d.data.group))
        .attr('y', (d) => yScale(d[1]))
        .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .on('mouseover', function (d, i) {
          d3.select('.tooltip-large')
            .style('top', () => {
              var y = d3.event.y
              return window.pageYOffset + y + 'px'
              if (i > 100) {
                return y - 100 + 'px'
              } else {
                return y + 20 + 'px'
              }
            })
            .style('left', d3.event.x + 40 + 'px')
            .html(
              `<div><span><b>Group:</b> </span><span>${
                d.data.group
              }</span></div>
                 <div><span><b>Due To Covid:</b> </span><span>${Math.round(
                   (d.data.covid / (d.data.rest + d.data.covid)) * 100
                 )}%</span></div>
                `
            )
            .transition()
            .duration(200)
            .style('opacity', 1)
        })
        .on('mouseout', function (d, i) {
          d3.select('.tooltip-large').style('opacity', 0)
        })

      var axis = root.append('g').attr('class', 'axis')
      axis.append('g').attr('class', 'axis x-axis')
      axis.append('g').attr('class', 'axis y-axis')

      var xAxis = d3.axisBottom(xScale)

      var yAxis = d3.axisLeft(yScale).tickPadding(5)

      var xAxisElements = axis
        .select('.x-axis')
        .call(xAxis)
        .attr('transform', `translate(${margin}, ${height + margin})`)

      axis
        .select('.y-axis')
        .call(yAxis)
        .attr('transform', `translate(${margin}, ${margin})`)

      root
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', (width + margin * 2) / 2)
        .attr('y', height + margin * 2 - 10)
        .style('font-weight', '600')
        .text('Percent Of Deaths Due To Covid 19')

      return root.node()
    })

  main
    .variable(observer('simpleBarChart'))
    .define('simpleBarChart', ['d3'], function (d3) {
      return (dataset, fill, tooltipClass, label) => {
        var width = 600
        var height = 400
        var margin = 50

        var xScale = d3
          .scaleBand()
          .domain(dataset.map((d) => d.group))
          .range([0, width])
          .padding(0.4)

        var yExtent = d3.extent(dataset, (d) => d.deaths)
        var yScale = d3
          .scaleLinear()
          .domain([0.2, yExtent[1] + 0.05])
          .range([height, 0])

        var root = d3
          .create('svg')
          .attr('width', width + margin * 2)
          .attr('height', height + margin * 2)
          .attr('class', 'covid-chart')

        var tooltip = d3
          .select('body')
          .append('div')
          .attr('class', `tooltip ${tooltipClass}`)
          .style('opacity', 0)

        var svg = root
          .append('g')
          .attr('width', width)
          .attr('height', height)
          .attr('transform', `translate(${margin}, ${margin})`)

        var bar = svg
          .selectAll('.bar')
          .data(dataset)
          .enter()
          .append('rect')
          .attr('x', (d) => xScale(d.group))
          .attr('y', (d) => yScale(d.deaths))
          .attr('width', xScale.bandwidth())
          .attr('height', (d) => height - yScale(d.deaths))
          .attr('fill', fill)
          .on('mouseover', function (d, i) {
            d3.select(`.${tooltipClass}`)
              .style('top', () => {
                var y = d3.event.y
                return window.pageYOffset + y + 'px'
                if (i > 100) {
                  return window.pageYOffset + y + 'px'
                  return y - 100 + 'px'
                } else {
                  return y + 20 + 'px'
                }
              })
              .style('left', d3.event.x + 40 + 'px')
              .html(
                `<div><span><b>Group:</b> </span><span>${d.group}</span></div>
               <div><span><b>Deaths:</b> </span><span>${d.deaths}</span></div>
              `
              )
              .transition()
              .duration(200)
              .style('opacity', 1)
          })
          .on('mouseout', function (d, i) {
            d3.select(`.${tooltipClass}`).style('opacity', 0)
          })

        var axis = root.append('g').attr('class', 'axis')
        axis.append('g').attr('class', 'axis x-axis')
        axis.append('g').attr('class', 'axis y-axis')

        var xAxis = d3.axisBottom(xScale)

        var yAxis = d3.axisLeft(yScale).tickPadding(5)

        var xAxisElements = axis
          .select('.x-axis')
          .call(xAxis)
          .attr('transform', `translate(${margin}, ${height + margin})`)

        axis
          .select('.y-axis')
          .call(yAxis)
          .attr('transform', `translate(${margin}, ${margin})`)

        root
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('x', (width + margin * 2) / 2)
          .attr('y', height + margin * 2 - 10)
          .style('font-weight', '600')
          .text(label)

        return root.node()
      }
    })
  main.variable(observer('data1')).define('data1', ['d3'], function (d3) {
    var url =
      'https://gist.githubusercontent.com/benjaminadk/7ef18a883fb8c95142b23c19e4bbd318/raw/1860fb99acf4348c3b722d9774ccc8499ed0d3e1/covid-deaths-by-age-20200724.csv'
    var data = d3.csv(url, ({ group, deaths }) => {
      return {
        group: group
          .replace(' years', '')
          .replace(' year', '')
          .replace('85 and over', 'Over 85')
          .trim(),
        deaths: parseInt(deaths, 10)
      }
    })
    return data
  })
  main.variable(observer('data2')).define('data2', ['d3'], function (d3) {
    var url =
      'https://gist.githubusercontent.com/benjaminadk/9461b513719ac63c9ecec1d5ea070e6c/raw/0713da476bc6b64232968ba2488f82bca260cec7/total-deaths-by-age-group.csv'
    var data = d3.csv(url, ({ group, deaths }) => {
      return {
        group: group
          .replace(' years', '')
          .replace(' year', '')
          .replace('85 and over', 'Over 85')
          .trim(),
        deaths: parseInt(deaths, 10)
      }
    })
    return data
  })
  main
    .variable(observer('data3'))
    .define('data3', ['data1', 'data2'], function (data1, data2) {
      var data = []
      for (let [i, d] of data1.entries()) {
        data.push({
          group: d.group,
          covid: d.deaths,
          rest: data2[i].deaths - d.deaths
        })
      }
      return data
    })
  main.variable(observer('d3')).define('d3', ['require'], function (require) {
    return require('d3@5')
  })

  return main
}
