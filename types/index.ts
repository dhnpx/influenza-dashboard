// Central export for all types
export * from './cdc';
export * from './wastewater';
export * from './alerts';
export * from './nextstrain';

// Common utility types
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color: string;
}
