interface MapControlsProps {
  metric: 'patients' | 'admissions' | 'per100k' | 'wastewater';
  onMetricChange: (metric: 'patients' | 'admissions' | 'per100k' | 'wastewater') => void;
}

export default function MapControls({ metric, onMetricChange }: MapControlsProps) {
  const options = [
    {
      value: 'per100k' as const,
      label: 'Per 100k',
      fullLabel: 'Admissions per 100,000',
      color: '#3b82f6',
      description: 'Population-adjusted admission rates'
    },
    {
      value: 'admissions' as const,
      label: 'Admissions',
      fullLabel: 'Total New Admissions',
      color: '#10b981',
      description: 'Weekly admission counts'
    },
    {
      value: 'patients' as const,
      label: 'Patients',
      fullLabel: 'Hospital Patients',
      color: '#f59e0b',
      description: 'Current hospitalized patients'
    },
    {
      value: 'wastewater' as const,
      label: 'Wastewater',
      fullLabel: 'Viral Concentration',
      color: '#8b5cf6',
      description: 'Early warning indicator'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Map Metric</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onMetricChange(option.value)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
              metric === option.value
                ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: option.color }}
              />
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${metric === option.value ? 'text-blue-900' : 'text-gray-700'}`}>
                  {option.fullLabel}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
