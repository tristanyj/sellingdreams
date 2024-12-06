import * as d3 from 'd3';
import { AD_CATEGORIES } from '~/assets/scripts/constants';
import { calcTextLength } from '~/assets/scripts/utils';
import type { d3GSelection } from '~/types';

export interface Arc {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function useChartDrawPoints() {
  const { opacity } = useChartConfig();

  const arcGenerator = d3
    .arc<Arc>()
    .innerRadius((d) => d.innerRadius)
    .outerRadius((d) => d.outerRadius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle);

  const interactionStore = useInteractionStore();
  const { setTooltipFigure, setTooltipCategory, setTooltipAd, setSelectedAd } = interactionStore;

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

      serie.areaPoints.forEach((point) => {
        const ad = ads.value.find((a) => a.id === `${point.year}-${serie.id}`);
        const figure = figures.value.find((f) => f.year === point.year);
        if (!figure) return;

        const figureCategory = figure.categories[serie.id];
        if (!figureCategory) return;

        if (ad) {
          const fontSize = 11;
          const arcGroup = g
            .append('g')
            .attr('class', 'center')
            .attr('transform', `translate(${(point.x0 + point.x1) / 2},${point.y})`);

          const textArcs = [
            {
              id: 'top-arc',
              text: ad.short_name,
              radius: radius.target + 4,
              startAngle: (3 * Math.PI) / 2,
              endAngle: (5 * Math.PI) / 2,
              color: '#fff',
              opacity: 0.9,
            },
            {
              id: 'bottom-arc',
              text: ad.client,
              radius: radius.target + 11,
              startAngle: (3 * Math.PI) / 2,
              endAngle: Math.PI / 2,
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

            const textLength = calcTextLength(g, arc.text, fontSize);

            const arcLength = Math.abs(arc.endAngle - arc.startAngle) * arc.radius;
            const textPercentage = (textLength / arcLength) * 100;
            const textOffsetPercentage = (100 - textPercentage) / 4;

            arcGroup.append('path').attr('id', arc.id).attr('d', textArc);

            arcGroup
              .append('text')
              .append('textPath')
              .attr('href', `#${arc.id}`)
              .attr('startOffset', `${textOffsetPercentage}%`)
              .attr('opacity', arc.opacity)
              .style('font-size', fontSize)
              .style('fill', arc.color)
              .text(arc.text);
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

        g.append('circle')
          .attr('class', `point point-${serie.id}`)
          .attr('id', `point-${serie.id}-${point.year}`)
          .attr('cx', (point.x0 + point.x1) / 2)
          .attr('cy', point.y)
          .attr('r', radius.small)
          .attr('fill', 'black')
          .attr('stroke', 'white');

        const interactionCircle = g
          .append('circle')
          .attr('class', `point-interaction${ad ? '-ad' : ''} point-${serie.id}-interaction`)
          .attr('id', `point-${serie.id}-${point.year}-interaction`)
          .attr('cx', (point.x0 + point.x1) / 2)
          .attr('cy', point.y)
          .attr('r', Math.abs(point.x0 - point.x1) > 0 ? radius.target + 15 : radius.small)
          .attr('opacity', 0)
          .on('click', function (_) {
            if (ad) {
              setSelectedAd(ad);
            }
          })
          .on('mouseenter', function (_) {
            const points = d3.selectAll(`.point`);
            points.attr('opacity', opacity.point.muted);
            d3.select(`#point-${serie.id}-${point.year}`)
              .attr('r', radius.large)
              .attr('opacity', 1);

            const yearText = d3.selectAll(`.year-text:not(#year-text-${point.year})`);
            yearText.attr('opacity', 0.25);

            const yearSubText = d3.selectAll(`.year-sub-text:not(#year-sub-text-${point.year})`);
            yearSubText.attr('opacity', 0.1);

            const yearLine = d3.selectAll(`.year-line:not(#year-line-${point.year})`);
            yearLine.attr('opacity', opacity.line.muted);

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
                slogan: ad.slogan,
                agency: ad.agency,
                short_name: ad.short_name,
              });
            }

            if (selectedArea.value) return;

            const ids = AD_CATEGORIES.filter((cat) => cat !== serie.id);
            const areas = ids.map((id) => d3.select(`#category-area-${id}`));
            areas.forEach((area) => area.attr('opacity', opacity.area.muted));
          })
          // .on('mousemove', (event) => {
          // updateMousePosition(event);
          // })
          .on('mouseout', function (_) {
            const points = d3.selectAll(`.point`);
            points.attr('opacity', 1);
            d3.select(`#point-${serie.id}-${point.year}`).attr('r', radius.small);

            const yearText = d3.selectAll(`.year-text`);
            yearText.attr('opacity', 1);

            const yearSubText = d3.selectAll(`.year-sub-text`);
            yearSubText.attr('opacity', 0.5);

            const yearLine = d3.selectAll(`.year-line`);
            yearLine.attr('opacity', opacity.line.enabled);

            setTooltipFigure(null);
            setTooltipCategory(null);
            setTooltipAd(null);

            if (selectedArea.value) return;

            const areas = AD_CATEGORIES.map((id) => d3.select(`#category-area-${id}`));
            areas.forEach((area) => area.attr('opacity', 1));
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
