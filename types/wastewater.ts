export interface WastewaterData {
  wwtp_id: string;
  sample_collect_date: string;
  pcr_target_avg_conc: number | string;
  state: string;
  county?: string;
  population_served?: number | string;
  reporting_jurisdiction?: string;
}

export interface ProcessedWastewaterData {
  state: string;
  date: Date;
  viralConcentration: number;
  county?: string;
  populationServed?: number;
}

export interface WastewaterByState {
  [stateCode: string]: {
    averageConcentration: number;
    sampleCount: number;
    latestDate: string;
  };
}
