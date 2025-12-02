import { getColorLegend } from '@/lib/utils/mapColors';

interface MapLegendProps {
  metric?: 'patients' | 'admissions' | 'per100k' | 'wastewater';
}

export default function MapLegend({ metric = 'per100k' }: MapLegendProps) {
  const legend = getColorLegend(metric);

  const getMetricLabel = () => {
    switch (metric) {
      case 'patients':
        return 'Hospital Patients';
      case 'admissions':
        return 'New Admissions';
      case 'per100k':
        return 'Admissions per 100k';
      case 'wastewater':
        return 'Viral Concentration (copies/L)';
      default:
        return 'Activity Level';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Activity Levels</h3>
      <p className="text-xs text-gray-500 mb-3">{getMetricLabel()}</p>
      <div className="space-y-2">
        {legend.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-sm flex-shrink-0 shadow-sm border border-gray-300"
              style={{
                backgroundColor: item.color,
                minWidth: '24px',
                minHeight: '24px'
              }}
            />
            <span className="text-xs text-gray-700 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      {metric === 'wastewater' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 italic">
            Higher concentrations = More viral activity
          </p>
        </div>
      )}
    </div>
  );
}
