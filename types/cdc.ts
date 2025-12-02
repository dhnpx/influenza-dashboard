export interface CDCFluData {
  week: string;
  total_specimens: string;
  percent_positive: string;
  week_start: string;
  region?: string;
  area?: string; // State name
}

export interface ProcessedCDCData {
  week: string;
  totalSpecimens: number;
  percentPositive: number;
  weekStart: Date;
  region?: string;
  state?: string;
}

export interface CDCByState {
  [stateCode: string]: {
    positivity: number;
    specimens: number;
    week: string;
  };
}
