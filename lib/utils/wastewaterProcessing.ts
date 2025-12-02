import { WastewaterData, ProcessedWastewaterData, WastewaterByState } from '@/types/wastewater';
import { parseNumeric } from './formatters';
import { mean } from 'simple-statistics';

/**
 * Process raw wastewater data from CDC API
 * @param rawData Array of raw wastewater records
 * @returns Array of processed wastewater data
 */
export function processWastewaterData(rawData: WastewaterData[]): ProcessedWastewaterData[] {
  return rawData
    .filter(item => {
      // Filter out records with missing critical data
      return item.pcr_target_avg_conc && item.sample_collect_date && item.wwtp_jurisdiction;
    })
    .map(item => ({
      state: item.wwtp_jurisdiction.toUpperCase(),
      date: new Date(item.sample_collect_date),
      viralConcentration: parseNumeric(item.pcr_target_avg_conc_lin || item.pcr_target_avg_conc),
      county: item.counties_served,
      populationServed: item.population_served ? parseNumeric(item.population_served) : undefined,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
}

/**
 * Aggregate wastewater data by state
 * @param data Array of processed wastewater data
 * @returns Object mapping state codes to aggregated data
 */
export function aggregateWastewaterByState(data: ProcessedWastewaterData[]): WastewaterByState {
  const stateMap: WastewaterByState = {};

  data.forEach(item => {
    const stateCode = item.state;

    if (!stateMap[stateCode]) {
      stateMap[stateCode] = {
        averageConcentration: 0,
        sampleCount: 0,
        latestDate: item.date.toISOString(),
      };
    }

    stateMap[stateCode].sampleCount += 1;

    // Update latest date if this sample is more recent
    const currentLatest = new Date(stateMap[stateCode].latestDate);
    if (item.date > currentLatest) {
      stateMap[stateCode].latestDate = item.date.toISOString();
    }
  });

  // Calculate average concentrations
  Object.keys(stateMap).forEach(stateCode => {
    const stateSamples = data.filter(item => item.state === stateCode);
    const concentrations = stateSamples.map(item => item.viralConcentration);

    if (concentrations.length > 0) {
      stateMap[stateCode].averageConcentration = mean(concentrations);
    }
  });

  return stateMap;
}

/**
 * Get the most recent wastewater data for each state
 * @param data Array of processed wastewater data
 * @returns Map of state code to most recent data point
 */
export function getLatestWastewaterByState(
  data: ProcessedWastewaterData[]
): Map<string, ProcessedWastewaterData> {
  const latestByState = new Map<string, ProcessedWastewaterData>();

  data.forEach(item => {
    const existing = latestByState.get(item.state);

    if (!existing || item.date > existing.date) {
      latestByState.set(item.state, item);
    }
  });

  return latestByState;
}

/**
 * Calculate national average viral concentration
 * @param data Array of processed wastewater data
 * @returns National average concentration
 */
export function calculateNationalAverage(data: ProcessedWastewaterData[]): number {
  if (data.length === 0) return 0;

  const concentrations = data.map(item => item.viralConcentration);
  return mean(concentrations);
}

/**
 * Get time series data for a specific state
 * @param data Array of processed wastewater data
 * @param stateCode State code (e.g., 'CA', 'NY')
 * @param limit Maximum number of data points to return
 * @returns Array of data points sorted by date (oldest first)
 */
export function getStateTimeSeries(
  data: ProcessedWastewaterData[],
  stateCode: string,
  limit: number = 52
): ProcessedWastewaterData[] {
  return data
    .filter(item => item.state === stateCode.toUpperCase())
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort ascending for time series
    .slice(-limit); // Get most recent N points
}

/**
 * Categorize viral concentration levels
 * @param concentration Viral concentration value
 * @returns Activity level category
 */
export function categorizeWastewaterLevel(concentration: number): {
  level: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Minimal';
  color: string;
} {
  if (concentration >= 10000) {
    return { level: 'Very High', color: '#991b1b' }; // dark red
  } else if (concentration >= 5000) {
    return { level: 'High', color: '#dc2626' }; // red
  } else if (concentration >= 2000) {
    return { level: 'Moderate', color: '#f59e0b' }; // amber
  } else if (concentration >= 500) {
    return { level: 'Low', color: '#fbbf24' }; // yellow
  } else {
    return { level: 'Minimal', color: '#10b981' }; // green
  }
}
