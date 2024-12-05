import * as d3 from 'd3';
import { AD_CATEGORIES } from '~/assets/scripts/constants';
import type { d3GSelection } from '~/types';

export function useChartDrawPoints() {
  const { opacity } = useChartConfig();

  const interactionStore = useInteractionStore();
  const { setTooltipPoint, setSelectedAd, updateMousePosition } = interactionStore;

  const figureStore = useFigureStore();
  const { selectedArea } = storeToRefs(figureStore);
  const { getSeries } = figureStore;

  const dataStore = useDataStore();
  const { ads } = storeToRefs(dataStore);

  const drawAreaPoints = (
    g: d3GSelection,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScalePoint<string>
  ) => {
    const series = getSeries(xScale, yScale);

    const radius = {
      small: 3,
      large: 6,
      target: 16,
    };

    series.forEach((serie) => {
      serie.areaPoints.forEach((point) => {
        const ad = ads.value.find((a) => a.id === `${point.year}-${serie.id}`);

        if (ad) {
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
          // .attr('fill', () => palette[k])
          .attr('fill', 'black')
          .attr('stroke', 'white');

        g.append('circle')
          .attr('class', `point-interaction${ad ? '-ad' : ''} point-${serie.id}-interaction`)
          .attr('id', `point-${serie.id}-${point.year}-interaction`)
          .attr('cx', (point.x0 + point.x1) / 2)
          .attr('cy', point.y)
          .attr('r', Math.abs(point.x0 - point.x1) > 0 ? radius.target : radius.small)
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

            setTooltipPoint({
              id: serie.id,
              name: serie.id,
            });

            if (selectedArea.value) return;

            const ids = AD_CATEGORIES.filter((cat) => cat !== serie.id);
            const areas = ids.map((id) => d3.select(`#category-area-${id}`));
            areas.forEach((area) => area.attr('opacity', opacity.area.muted));
          })
          .on('mousemove', (event) => {
            updateMousePosition(event);
          })
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

            setTooltipPoint(null);

            if (selectedArea.value) return;

            const areas = AD_CATEGORIES.map((id) => d3.select(`#category-area-${id}`));
            areas.forEach((area) => area.attr('opacity', 1));
          });
      });
    });
  };

  return {
    drawAreaPoints,
  };
}
