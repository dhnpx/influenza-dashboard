import { linearRegression, standardDeviation, mean } from 'simple-statistics';

/**
 * Calculate trend direction and strength using linear regression
 * @param values Array of numeric values (ordered chronologically)
 * @returns Object with trend info (slope, direction, strength)
 */
export function calculateTrend(values: number[]): {
  slope: number;
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: 'strong' | 'moderate' | 'weak';
  percentChange: number;
} {
  if (values.length < 2) {
    return {
      slope: 0,
      direction: 'stable',
      strength: 'weak',
      percentChange: 0,
    };
  }

  // Create data points for regression (x = index, y = value)
  const dataPoints: Array<[number, number]> = values.map((value, index) => [index, value]);

  // Calculate linear regression
  const regression = linearRegression(dataPoints);
  const slope = regression.m;

  // Calculate percent change from first to last
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const percentChange = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

  // Determine direction
  let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (Math.abs(percentChange) < 5) {
    direction = 'stable';
  } else if (slope > 0) {
    direction = 'increasing';
  } else {
    direction = 'decreasing';
  }

  // Determine strength based on standard deviation and slope
  const stdDev = values.length > 1 ? standardDeviation(values) : 0;
  const meanValue = mean(values);
  const coefficientOfVariation = meanValue !== 0 ? stdDev / meanValue : 0;

  let strength: 'strong' | 'moderate' | 'weak' = 'weak';
  if (Math.abs(percentChange) > 20 && coefficientOfVariation > 0.2) {
    strength = 'strong';
  } else if (Math.abs(percentChange) > 10) {
    strength = 'moderate';
  }

  return {
    slope,
    direction,
    strength,
    percentChange,
  };
}

/**
 * Calculate moving average for smoothing time series data
 * @param values Array of numeric values
 * @param windowSize Number of points to average (default: 3)
 * @returns Array of moving averages
 */
export function calculateMovingAverage(values: number[], windowSize: number = 3): number[] {
  if (values.length < windowSize) {
    return values;
  }

  const movingAverages: number[] = [];

  for (let i = 0; i <= values.length - windowSize; i++) {
    const window = values.slice(i, i + windowSize);
    const avg = mean(window);
    movingAverages.push(avg);
  }

  return movingAverages;
}

/**
 * Detect anomalies using standard deviation threshold
 * @param values Array of numeric values
 * @param threshold Number of standard deviations for anomaly detection (default: 2)
 * @returns Array of indices where anomalies are detected
 */
export function detectAnomalies(values: number[], threshold: number = 2): number[] {
  if (values.length < 3) {
    return [];
  }

  const meanValue = mean(values);
  const stdDev = standardDeviation(values);
  const anomalyIndices: number[] = [];

  values.forEach((value, index) => {
    const zScore = Math.abs((value - meanValue) / stdDev);
    if (zScore > threshold) {
      anomalyIndices.push(index);
    }
  });

  return anomalyIndices;
}

/**
 * Calculate percentage change between two values
 * @param current Current value
 * @param previous Previous value
 * @returns Percentage change
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Simple forecast using linear regression
 * @param values Historical values
 * @param periodsAhead Number of periods to forecast
 * @returns Array of forecasted values
 */
export function forecastLinear(values: number[], periodsAhead: number): number[] {
  if (values.length < 2) {
    return Array(periodsAhead).fill(values[0] || 0);
  }

  // Create data points for regression
  const dataPoints: Array<[number, number]> = values.map((value, index) => [index, value]);
  const regression = linearRegression(dataPoints);

  // Generate forecasts
  const forecasts: number[] = [];
  const lastIndex = values.length - 1;

  for (let i = 1; i <= periodsAhead; i++) {
    const forecastValue = regression.m * (lastIndex + i) + regression.b;
    forecasts.push(Math.max(0, forecastValue)); // Ensure non-negative
  }

  return forecasts;
}
