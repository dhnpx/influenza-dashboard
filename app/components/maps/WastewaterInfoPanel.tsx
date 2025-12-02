import { WastewaterData } from '@/types/wastewater';
import { processWastewaterData, calculateNationalAverage } from '@/lib/utils/wastewaterProcessing';

interface WastewaterInfoPanelProps {
  data: WastewaterData[];
}

export default function WastewaterInfoPanel({ data }: WastewaterInfoPanelProps) {
  const processedData = processWastewaterData(data);
  const nationalAverage = calculateNationalAverage(processedData);
  const detectionSites = new Set(data.map(d => d.sewershed_id)).size;
  const statesMonitored = new Set(data.map(d => d.wwtp_jurisdiction)).size;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-4 border border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-blue-900">Wastewater Surveillance</h3>
          <p className="text-xs text-blue-700 mt-1">Early warning indicator - Viral RNA detection</p>
        </div>
        <div className="text-xs text-blue-600 bg-white px-2 py-1 rounded-full">
          {processedData.length} samples
        </div>
      </div>

      <div className="space-y-3">
        {/* National Average */}
        <div className="bg-white/80 rounded-lg p-3 border border-blue-100">
          <div className="text-xs font-medium text-blue-900">National Average</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {nationalAverage.toFixed(0)}
          </div>
          <div className="text-xs text-blue-700">copies/L wastewater</div>
        </div>

        {/* Detection Sites */}
        <div className="bg-white/80 rounded-lg p-3 border border-green-100">
          <div className="text-xs font-medium text-green-900">Detection Sites</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {detectionSites}
          </div>
          <div className="text-xs text-green-700">wastewater treatment plants</div>
        </div>

        {/* States Monitored */}
        <div className="bg-white/80 rounded-lg p-3 border border-purple-100">
          <div className="text-xs font-medium text-purple-900">States Monitored</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {statesMonitored}
          </div>
          <div className="text-xs text-purple-700">jurisdictions</div>
        </div>
      </div>

      {/* Educational Information */}
      <div className="mt-4 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong className="font-semibold">What is wastewater surveillance?</strong> This early warning system detects influenza RNA in sewage 4-7 days before clinical symptoms appear in the population. Higher viral concentrations indicate increased community transmission.
        </p>
      </div>
    </div>
  );
}
