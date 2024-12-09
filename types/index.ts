// --------------------------------
// Dataset
// --------------------------------

export type CategoryKey =
  | 'radio'
  | 'television'
  | 'internet'
  | 'periodicals'
  | 'out_of_home'
  | 'direct_mail'
  | 'yellow_pages'
  | 'miscellaneous';

export type AdId = `${number}-${CategoryKey}`;

export interface Category {
  id: CategoryKey;
  name: string;
  description: string;
  color: `#${string}`;
}

export interface Event {
  year: number;
  name: string;
  categories: CategoryKey[];
}

interface FigureCategory {
  nominal: number;
  real: number;
  rank: number;
  proportion_of_ads: number;
}

export interface Figure {
  year: number;
  categories: Record<CategoryKey, FigureCategory>;
  total: {
    nominal: number;
    real: number;
    proportion_of_gdp: number;
  };
  gdp: {
    real: number;
    real_per_capita: number;
    nominal: number;
    nominal_per_capita: number;
    population: number;
    deflator: number;
  };
}

export type FigureSliceCategory = {
  serieId: string;
  value: number;
  position: number;
  width: number;
  beforeWidth: number;
};

export type FigureSlice = {
  year: number;
  total: number;
  y: number;
  values: Map<string, FigureSliceCategory>;
};

export interface Ad {
  id: AdId;
  year: number;
  category: CategoryKey;
  client: string;
  name: string;
  agency: string;
  youtube_link: string;
  description: string[];
}

interface Tooltip {
  id: string;
}

export interface TooltipCategory extends Tooltip {
  name: string;
  description: string;
  color: `#${string}`;
  center?: boolean;
}

export interface TooltipFigure extends Tooltip {
  year: number;
  nominal: number;
  real: number;
  rank: number;
  proportion_of_ads: number;
}

export interface TooltipAd extends Tooltip {
  year: number;
  category: CategoryKey;
  client: string;
  name: string;
  agency: string;
}

export interface ImageAd {
  id: AdId;
  url: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  opacity: number;
}

export interface BgAd {
  id: AdId;
  url: string;
  alt: string;
  offset: number;
}

// --------------------------------
// D3
// --------------------------------

export type d3GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export interface Line {
  className: string;
  id?: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  transform: string;
}
