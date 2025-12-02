import { formatNumber, parseNumeric } from '@/lib/utils/formatters';

interface StateDetailPanelProps {
  stateName: string;
  stateCode: string;
  data: {
    totalconffluhosppats?: string;
    totalconfflunewadm?: string;
    totalconfflunewadmper100k?: string;
    totalconffluicupats?: string;
    pctinptbedsocc?: string;
  } | null;
  onClose: () => void;
}

export default function StateDetailPanel({ stateName, stateCode, data, onClose }: StateDetailPanelProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{stateName}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500">No data available for {stateName}</p>
      </div>
    );
  }

  const patients = parseNumeric(data.totalconffluhosppats || '0');
  const admissions = parseNumeric(data.totalconfflunewadm || '0');
  const per100k = parseNumeric(data.totalconfflunewadmper100k || '0');
  const icuPatients = parseNumeric(data.totalconffluicupats || '0');

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{stateName}</h3>
          <p className="text-xs text-gray-500">{stateCode}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Hospital Patients</span>
          <span className="text-sm font-semibold text-gray-900">{formatNumber(patients)}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">New Admissions</span>
          <span className="text-sm font-semibold text-gray-900">{formatNumber(admissions)}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Per 100k Population</span>
          <span className="text-sm font-semibold text-gray-900">{per100k.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ICU Patients</span>
          <span className="text-sm font-semibold text-gray-900">{formatNumber(icuPatients)}</span>
        </div>
      </div>
    </div>
  );
}
