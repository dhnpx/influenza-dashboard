import { getColorLegend } from '@/lib/utils/mapColors';

export default function MapLegend() {
  const legend = getColorLegend();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Level</h3>
      <div className="space-y-2">
        {legend.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-6 h-4 rounded border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
