import type { d3GSelection } from '~/types';

export function formatNumber(value: number, decimals?: number): string {
  if (value < 1e3) return value.toFixed(decimals ?? 1);
  if (value < 1e6) return `${(value / 1e3).toFixed(decimals ?? 1)}k`;
  if (value < 1e9) return `${value / 1e6}M`;
  return `${value / 1e9}B`;
}

export function calcTextLength(g: d3GSelection, text: string, fontSize: number) {
  const tempText = g
    .append('text')
    .text(text)
    .style('font-size', `${fontSize}px`)
    .style('visibility', 'hidden');

  const bbox = tempText.node()?.getBBox();
  const textLength = bbox ? bbox.width : 0;
  tempText.remove();
  return textLength;
}
