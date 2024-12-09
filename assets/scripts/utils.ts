import { select } from 'd3-selection';
import type { d3GSelection } from '~/types';

export function formatNumber(value: number): string {
  if (value < 1e3) return value.toFixed(2);
  if (value < 1e6) return `${(value / 1e3).toFixed(2)}k`;
  if (value < 1e9) return `${(value / 1e6).toFixed(2)}M`;
  return `${(value / 1e9).toFixed(2)}B`;
}

export function formatDescription(descriptionParts: string[]) {
  return descriptionParts.map((part) => part.replace(/\\/g, '"'));
}

export function truncateText(text: string, maxLength: number, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + suffix;
}

export function wrapText(text: d3GSelection, maxWidth: number) {
  text.each(function () {
    const text = select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.2;
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy')) || 0;
    let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', `${dy}em`);

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      const computedTextLength = tspan.node()?.getComputedTextLength() || 0;
      if (computedTextLength && computedTextLength > maxWidth) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }

    const textWidth = Math.max(
      ...text
        .selectAll('tspan')
        .nodes()
        .map((tspan) => (tspan ? (tspan as SVGTextElement).getComputedTextLength() : 0))
    );

    text.selectAll('tspan').each(function () {
      const tspan = select(this);
      const tspanWidth = (tspan.node() as SVGTextElement)?.getComputedTextLength() || 0;
      tspan.attr('x', (textWidth - tspanWidth) / 2);
    });
  });
}

export function calcTextLength(g: d3GSelection, text: string, fontSize: number) {
  const tempText = g
    .append('text')
    .text(text)
    .attr('class', 'text-path')
    .style('font-size', `${fontSize}px`)
    .style('visibility', 'hidden');

  const bbox = tempText.node()?.getBBox();
  const textLength = bbox ? bbox.width : 0;
  tempText.remove();
  return textLength;
}
