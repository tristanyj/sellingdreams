import { select } from 'd3-selection';
import type { d3GSelection } from '~/types';

export function formatNumber(value: number, decimals?: number): string {
  if (value < 1e3) return value.toFixed(decimals ?? 1);
  if (value < 1e6) return `${(value / 1e3).toFixed(decimals ?? 1)}k`;
  if (value < 1e9) return `${value / 1e6}M`;
  return `${value / 1e9}B`;
}

export function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/).reverse();
  const lines: string[] = [];
  let line: string[] = [];
  let lineLength = 0;
  const spaceWidth = 4; // Approximate space width

  while (words.length > 0) {
    const word = words.pop()!;
    const wordWidth = word.length * 5.5; // Approximate width per character

    if (lineLength + wordWidth + (line.length > 0 ? spaceWidth : 0) > width) {
      if (line.length > 0) {
        lines.push(line.join(' '));
        line = [word];
        lineLength = wordWidth;
      } else {
        // If single word is too long, just add it
        lines.push(word);
      }
    } else {
      line.push(word);
      lineLength += wordWidth + (line.length > 0 ? spaceWidth : 0);
    }
  }

  if (line.length > 0) {
    lines.push(line.join(' '));
  }

  return lines;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapText2(text: d3.Selection<SVGElement, any, any, any>, maxWidth: number) {
  text.each(function () {
    const text = select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
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

    // Calculate the maximum width of the text block
    const textWidth = Math.max(
      ...text
        .selectAll('tspan')
        .nodes()
        .map((tspan) => (tspan ? (tspan as SVGTextElement).getComputedTextLength() : 0))
    );

    // Center each line by adjusting the x attribute of each tspan
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
