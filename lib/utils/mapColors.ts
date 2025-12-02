// Color scale for choropleth maps
// Based on CDC flu activity severity levels
// Uses absolute thresholds (per 100k population) for consistency

export function getColorForValue(value: number): string {
  if (value === 0) return '#f3f4f6'; // Gray for no data

  // Absolute thresholds based on public health severity levels
  if (value >= 6.0) return '#dc2626'; // Red - Very High
  if (value >= 3.0) return '#f97316'; // Orange - High
  if (value >= 1.0) return '#fbbf24'; // Yellow - Moderate
  return '#10b981'; // Green - Minimal/Low
}

export function getColorLegend() {
  return [
    { color: '#dc2626', label: 'Very High (≥6.0)' },
    { color: '#f97316', label: 'High (3.0-5.9)' },
    { color: '#fbbf24', label: 'Moderate (1.0-2.9)' },
    { color: '#10b981', label: 'Low (<1.0)' },
    { color: '#f3f4f6', label: 'No Data' },
  ];
}
