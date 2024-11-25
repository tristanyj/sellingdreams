import * as d3 from 'd3';

import type { d3GSelection, Figure } from '~/types';

interface ProcessedDataPoint {
  key: string;
  value: number;
  year: number;
  rank: number;
  proportion: number;
}

const xMargin = 200;

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
    // 1. Setup scales (same as before)
    const yScale = d3
      .scaleTime()
      .domain([new Date(1900, 0, 1), new Date(2000, 11, 31)])
      .range([margin, height - margin]);

    const xScale = d3
      .scaleLinear()
      .domain([1, 8])
      .range([xMargin, width - xMargin]);

    // Modify width scale to use full available space
    const availableWidth = (width - xMargin * 10) / 2; // divide by 2 as we extend both sides
    const widthScale = d3.scaleLinear().domain([0, 1]).range([0, availableWidth]); // This will make proportions fill available space

    // 2. Prepare data (same as before)
    const categories = [
      'radio',
      'television',
      'internet',
      'periodicals',
      'out_of_home',
      'direct_mail',
      'yellow_pages',
      'miscellaneous',
    ];

    const ribbonData = categories.map((category) => {
      return figures.map((year) => ({
        year: new Date(year.year, 0, 1),
        category: category,
        rank: year.categories[category].rank,
        proportion: year.categories[category].proportion_of_ads,
      }));
    });

    // 3. Create area generator (same as before)
    const area = d3
      .area<any>()
      .x0((d) => xScale(d.rank) - widthScale(d.proportion))
      .x1((d) => xScale(d.rank) + widthScale(d.proportion))
      .y((d) => yScale(d.year))
      .curve(d3.curveBasis);

    // 4. Draw the ribbons
    g.selectAll('.ribbon')
      .data(ribbonData)
      .join('path')
      .attr('class', 'ribbon')
      .attr('d', area)
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .attr('opacity', 0.7);

    // 5. Add labels above ribbons
    ribbonData.forEach((categoryData, i) => {
      // Get first data point for initial position
      const firstPoint = categoryData[0];
      const lastPoint = categoryData[categoryData.length - 1];

      // Add start label
      g.append('text')
        .attr('class', 'ribbon-label')
        .attr('x', xScale(firstPoint.rank))
        .attr('y', yScale(firstPoint.year) - 10) // Position above the ribbon
        .attr('text-anchor', 'middle')
        .attr('fill', d3.schemeCategory10[i])
        .text(firstPoint.category);

      // Add end label
      g.append('text')
        .attr('class', 'ribbon-label')
        .attr('x', xScale(lastPoint.rank))
        .attr('y', yScale(lastPoint.year) + 20) // Position below the ribbon
        .attr('text-anchor', 'middle')
        .attr('fill', d3.schemeCategory10[i])
        .text(lastPoint.category);
    });

    // 6. Add y-axis (same as before)
    const yAxis = d3.axisLeft(yScale).ticks(d3.timeYear.every(10)).tickFormat(d3.timeFormat('%Y'));

    g.append('g').attr('transform', `translate(${xMargin}, 0)`).call(yAxis);
  };

  return {
    drawSteamGraph,
  };
}
