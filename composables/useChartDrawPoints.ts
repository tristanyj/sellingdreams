import * as d3 from 'd3';
import { calcTextLength, truncateText } from '~/assets/scripts/utils';
import type { d3GSelection } from '~/types';

export function useChartDrawPoints() {
  const arcGenerator = d3
    .arc<{
      innerRadius: number;
      outerRadius: number;
      startAngle: number;
      endAngle: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
    }>()
    .innerRadius((d) => d.innerRadius)
    .outerRadius((d) => d.outerRadius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle);

  const interactionStore = useInteractionStore();
  const { setTooltipFigure, updateMousePosition, setTooltipCategory, setTooltipAd, setSelectedAd } =
    interactionStore;

  const figureStore = useFigureStore();
  const { selectedArea, figures, series } = storeToRefs(figureStore);

  const dataStore = useDataStore();
  const { ads, categories } = storeToRefs(dataStore);

  const drawAreaPoints = (g: d3GSelection) => {
    const radius = {
      small: 3,
      large: 6,
      target: 18,
    };

    series.value.forEach((serie) => {
      const category = categories.value.find((c) => c.id === serie.id);
      if (!category) return;

      const isMuted = selectedArea.value && selectedArea.value !== serie.id;

      serie.areaPoints.forEach((point) => {
        const ad = ads.value.find((a) => a.id === `${point.year}-${serie.id}`);
        const figure = figures.value.find((f) => f.year === point.year);
        if (!figure) return;

        const figureCategory = figure.categories[serie.id];
        if (!figureCategory) return;

        if (ad) {
          const fontSize = 12;
          const arcGroup = g
            .append('g')
            .attr('class', 'center')
            .attr('transform', `translate(${(point.x0 + point.x1) / 2},${point.y})`);

          const textArcs = [
            {
              id: 'top-arc',
              text: ad.name,
              radius: radius.target + 4,
              startAngle: Math.PI,
              endAngle: Math.PI * 3,
              color: '#fff',
              opacity: 0.9,
            },
            {
              id: 'bottom-arc',
              text: ad.client,
              radius: radius.target + 11,
              startAngle: Math.PI * 2,
              endAngle: 0,
              color: '#fff',
              opacity: 0.6,
            },
          ];

          textArcs.forEach((arc) => {
            const textArc = arcGenerator({
              innerRadius: arc.radius,
              outerRadius: arc.radius,
              startAngle: arc.startAngle,
              endAngle: arc.endAngle,
              data: null,
            });

            const arcLength = Math.abs(arc.endAngle - arc.startAngle) * arc.radius;
            const maxTextWidth = arcLength / fontSize;
            const truncatedText = truncateText(arc.text, Math.floor(maxTextWidth), '..');
            const truncatedTextLength = calcTextLength(g, truncatedText, fontSize);
            const textPercentage = (truncatedTextLength / arcLength) * 100;
            const textOffsetPercentage = (100 - textPercentage) / 4;

            arcGroup.append('path').attr('id', arc.id).attr('d', textArc);

            arcGroup
              .append('text')
              .append('textPath')
              .attr('class', 'text-path')
              .attr('href', `#${arc.id}`)
              .attr('startOffset', `${textOffsetPercentage}%`)
              .attr('opacity', arc.opacity)
              .style('font-size', fontSize)
              .style('fill', arc.color)
              .text(truncatedText);
          });

          g.append('circle')
            .attr('class', `point-bg point-bg-${serie.id}`)
            .attr('id', `point-bg-${serie.id}-${point.year}`)
            .attr('cx', (point.x0 + point.x1) / 2)
            .attr('cy', point.y)
            .attr('r', radius.target)
            .attr('opacity', 0.75)
            .attr('fill', 'white')
            .attr('stroke', 'white');
        }

        const yearElements = d3.selectAll(`.year-group:not(#year-group-${point.year})`);

        g.append('circle')
          .attr('class', `point point-${serie.id}`)
          .attr('id', `point-${serie.id}-${point.year}`)
          .attr('cx', (point.x0 + point.x1) / 2)
          .attr('cy', point.y)
          .attr('r', radius.small)
          .attr('fill', 'black')
          .attr('stroke', 'white')
          .classed('disabled', !!isMuted);

        const interactionCircle = g
          .append('circle')
          .attr('class', `point-interaction${ad ? '-ad' : ''} point-${serie.id}-interaction`)
          .attr('id', `point-${serie.id}-${point.year}-interaction`)
          .attr('cx', (point.x0 + point.x1) / 2)
          .attr('cy', point.y)
          .attr(
            'r',
            Math.abs(point.x0 - point.x1) > 0
              ? ad
                ? radius.target + 15
                : radius.target
              : radius.small + 6
          )
          .attr('opacity', 0)
          .on('click', function (_) {
            if (ad) {
              setSelectedAd(ad);
            }
          })
          .on('mouseenter', function (_) {
            const points = d3.selectAll(`.point`);
            points.classed('disabled', true);

            d3.select(`#point-${serie.id}-${point.year}`)
              .attr('r', radius.large)
              .classed('disabled', false);

            yearElements.classed('disabled', true);

            setTooltipFigure({
              id: serie.id,
              year: point.year,
              nominal: figureCategory.nominal,
              real: figureCategory.real,
              rank: figureCategory.rank,
              proportion_of_ads: figureCategory.proportion_of_ads,
            });

            setTooltipCategory({
              id: serie.id,
              name: category.name,
              description: category.description,
              color: category.color,
            });

            if (ad) {
              setTooltipAd({
                id: ad.id,
                year: ad.year,
                category: ad.category,
                client: ad.client,
                name: ad.name,
                agency: ad.agency,
              });
            }

            if (selectedArea.value) return;

            d3.selectAll(`.category-area:not(#category-area-${serie.id})`).classed(
              'disabled',
              true
            );
          })
          .on('mousemove', (event) => {
            updateMousePosition(event);
          })
          .on('mouseout', function (_) {
            if (selectedArea.value) {
              d3.selectAll(`.point`).classed('disabled', true);
              const points = d3.selectAll(`.point-${selectedArea.value}`);
              points.classed('disabled', false);
            } else {
              const points = d3.selectAll(`.point`);
              points.classed('disabled', false);
            }

            d3.select(`#point-${serie.id}-${point.year}`).attr('r', radius.small);

            yearElements.classed('disabled', false);

            setTooltipFigure(null);
            setTooltipCategory(null);
            setTooltipAd(null);

            if (selectedArea.value) return;

            d3.selectAll(`.category-area`).classed('muted', false).classed('disabled', false);
          });

        if (ad) {
          interactionCircle.append('title').text('Click to see more details');
        }
      });
    });
  };

  return {
    drawAreaPoints,
  };
}
