// --------------------------------
// Dataset
// --------------------------------

interface Category {
  nominal: number;
  real: number;
  rank: number;
  proportion_of_ads: number;
}

export interface Line {
  className: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  transform: string;
}

export interface Figure {
  year: number;
  categories: Record<
    | 'radio'
    | 'television'
    | 'internet'
    | 'periodicals'
    | 'out_of_home'
    | 'direct_mail'
    | 'yellow_pages'
    | 'miscellaneous',
    Category
  >[];
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

export interface Ad {
  year: number;
  name: string;
  client: string;
}

// --------------------------------
// D3
// --------------------------------

export type d3GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;
