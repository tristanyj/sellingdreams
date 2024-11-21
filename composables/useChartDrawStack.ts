import * as d3 from 'd3';

import type { d3GSelection, Figure } from '~/types';

type SeriesPoint = d3.SeriesPoint<Figure>; // This includes the .data property

const selectableKeys = [
  'internet',
  'radio',
  'yellow_pages',
  'out_of_home',
  'periodicals',
  'direct_mail',
  'miscellaneous',
  'television',
];

export function useChartDrawStack() {
  const { width, height, margin } = useChartConfig();
  // ------------------------------
  // Main Config
  // ------------------------------

  const drawSteamGraph = (g: d3GSelection, figures: Figure[]) => {
    const parseYear = (year: number) => new Date(year, 0, 1);

    const stack = d3
      .stack<Figure, string>()
      .keys(selectableKeys)
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut);

    const stackedData = stack(figures);

    const xScale = d3
      .scaleTime()
      .domain([
        parseYear(d3.min(figures, (d) => d.year) || 1900),
        parseYear(d3.max(figures, (d) => d.year) || 2000),
      ])
      .range([margin, width - margin]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(stackedData, (layer) => d3.min(layer, (d) => d[0])) || 0,
        d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1])) || 0,
      ])
      .range([height - margin, margin]);

    g.append('g')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(d3.axisBottom(xScale));

    g.append('g').attr('transform', `translate(${margin}, 0)`).call(d3.axisLeft(yScale));

    const area = d3
      .area<SeriesPoint>()
      .x((d) => xScale(parseYear(d.data.year)))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveLinear);

    const colorScale = d3.scaleOrdinal().domain(selectableKeys).range(d3.schemeCategory10);

    g.selectAll('path')
      .data(stackedData)
      .join('path')
      .attr('d', area)
      .attr('fill', (d) => colorScale(d.key) as string)
      .attr('opacity', 0.5);

    // ---------------------------------
    // DEBUG
    // ---------------------------------

    // Add these console logs
    console.log('TV last year:', figures[figures.length - 1].television);
    console.log('Radio last year:', figures[figures.length - 1].radio);

    // Check if data is properly sorted
    console.log(
      'Years in order:',
      figures.map((f) => f.year)
    );

    // And verify the actual x scale conversion
    console.log('Last year conversion:', xScale(parseYear(2000)));
    console.log('Scale range:', xScale.range());

    // ---------------------------------
    // LEGEND
    // ---------------------------------

    const legendGroup = g
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin - 150}, ${margin})`);

    const legendItems = legendGroup
      .selectAll('.legend-item')
      .data(selectableKeys)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d) as string);

    legendItems
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text((d) => d.replace(/_/g, ' '))
      .style('font-size', '12px')
      .style('text-transform', 'capitalize');

    g.selectAll('.stream-label')
      .data(stackedData)
      .join('text')
      .attr('class', 'stream-label')
      .attr('x', width - margin)
      .attr('y', (d) => yScale((d[d.length - 1][0] + d[d.length - 1][1]) / 2))
      .text((d) => d.key)
      .attr('font-size', '10px')
      .attr('alignment-baseline', 'middle');
  };

  return {
    drawSteamGraph,
  };
}
