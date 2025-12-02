// Color scale for choropleth maps
// Based on CDC flu activity severity levels
// Uses metric-specific thresholds

export function getColorForValue(
  value: number,
  metricType: 'per100k' | 'admissions' | 'patients' | 'wastewater' = 'per100k'
): string {
  if (value === 0) return '#f3f4f6'; // Gray for no data

  if (metricType === 'wastewater') {
    // Wastewater concentration thresholds (copies/L)
    if (value >= 10000) return '#991b1b'; // Dark Red - Very High
    if (value >= 5000) return '#dc2626'; // Red - High
    if (value >= 2000) return '#f97316'; // Orange - Moderate
    if (value >= 500) return '#fbbf24'; // Yellow - Low
    return '#10b981'; // Green - Minimal
  }

  if (metricType === 'per100k') {
    // Per 100k population thresholds (public health standard)
    if (value >= 6.0) return '#dc2626'; // Red - Very High
    if (value >= 3.0) return '#f97316'; // Orange - High
    if (value >= 1.0) return '#fbbf24'; // Yellow - Moderate
    return '#10b981'; // Green - Minimal/Low
  }

  if (metricType === 'admissions') {
    // Total admissions thresholds (raw counts)
    if (value >= 500) return '#dc2626'; // Red - Very High
    if (value >= 200) return '#f97316'; // Orange - High
    if (value >= 50) return '#fbbf24'; // Yellow - Moderate
    return '#10b981'; // Green - Low
  }

  if (metricType === 'patients') {
    // Total hospitalized patients thresholds (raw counts)
    if (value >= 1000) return '#dc2626'; // Red - Very High
    if (value >= 400) return '#f97316'; // Orange - High
    if (value >= 100) return '#fbbf24'; // Yellow - Moderate
    return '#10b981'; // Green - Low
  }

  return '#f3f4f6'; // Default gray
}

export function getColorLegend(metricType: 'per100k' | 'admissions' | 'patients' | 'wastewater' = 'per100k') {
  if (metricType === 'wastewater') {
    return [
      { color: '#991b1b', label: 'Very High (≥10,000)' },
      { color: '#dc2626', label: 'High (5,000-9,999)' },
      { color: '#f97316', label: 'Moderate (2,000-4,999)' },
      { color: '#fbbf24', label: 'Low (500-1,999)' },
      { color: '#10b981', label: 'Minimal (<500)' },
    ];
  }

  if (metricType === 'per100k') {
    return [
      { color: '#dc2626', label: 'Very High (≥6.0)' },
      { color: '#f97316', label: 'High (3.0-5.9)' },
      { color: '#fbbf24', label: 'Moderate (1.0-2.9)' },
      { color: '#10b981', label: 'Low (<1.0)' },
    ];
  }

  if (metricType === 'admissions') {
    return [
      { color: '#dc2626', label: 'Very High (≥500)' },
      { color: '#f97316', label: 'High (200-499)' },
      { color: '#fbbf24', label: 'Moderate (50-199)' },
      { color: '#10b981', label: 'Low (<50)' },
    ];
  }

  if (metricType === 'patients') {
    return [
      { color: '#dc2626', label: 'Very High (≥1,000)' },
      { color: '#f97316', label: 'High (400-999)' },
      { color: '#fbbf24', label: 'Moderate (100-399)' },
      { color: '#10b981', label: 'Low (<100)' },
    ];
  }

  return [
    { color: '#dc2626', label: 'Very High' },
    { color: '#f97316', label: 'High' },
    { color: '#fbbf24', label: 'Moderate' },
    { color: '#10b981', label: 'Low' },
  ];
}
