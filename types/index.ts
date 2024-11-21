// --------------------------------
// Dataset
// --------------------------------

export interface Figure {
  year: number;
  radio: number;
  television: number;
  internet: number;
  periodicals: number;
  out_of_home: number;
  direct_mail: number;
  yellow_pages: number;
  miscellaneous: number;
  nominal_total: number;
  real_total: number;
  nominal_gdp: number;
  real_gdp: number;
  gdp_deflator: number;
  [key: string]: number;
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
