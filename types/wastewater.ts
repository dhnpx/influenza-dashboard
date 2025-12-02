export interface WastewaterData {
  record_id: string;
  sewershed_id: string;
  wwtp_jurisdiction: string;
  sample_collect_date: string;
  pcr_target: string;
  pcr_target_avg_conc: string;
  pcr_target_avg_conc_lin: string;
  pcr_target_units: string;
  counties_served?: string;
  population_served?: string;
  county_fips?: string;
  date_updated?: string;
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
