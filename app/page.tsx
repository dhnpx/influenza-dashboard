'use client';

import { useState, useEffect } from 'react';
import { format, subWeeks } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import dynamic from 'next/dynamic';
import MetricCard from './components/ui/MetricCard';
import MultiLineChart from './components/charts/MultiLineChart';
import { calculateWeekOverWeekChange, getTrendDirection, calculatePercentage, getDominantCategory } from '@/lib/utils/calculations';
import { parseNumeric } from '@/lib/utils/formatters';
import { WastewaterData } from '@/types/wastewater';
import { processWastewaterData, calculateNationalAverage } from '@/lib/utils/wastewaterProcessing';

// Dynamic import for map to avoid SSR issues with Leaflet
const FluMap = dynamic(() => import('./components/maps/FluMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

const MapLegend = dynamic(() => import('./components/maps/MapLegend'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-48 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-4 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  ),
});

const MapControls = dynamic(() => import('./components/maps/MapControls'), {
  ssr: false,
});

const StateDetailPanel = dynamic(() => import('./components/maps/StateDetailPanel'), {
  ssr: false,
});

const WastewaterInfoPanel = dynamic(() => import('./components/maps/WastewaterInfoPanel'), {
  ssr: false,
});

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type CDCData = {
  weekendingdate: string;
  jurisdiction: string;
  totalconffluhosppats?: string;
  totalconfflunewadm?: string;
  totalconfflunewadmper100k?: string;
  pctconffluinptbeds?: string;
  totalconffluicupats?: string;
  pcticubedsocc?: string;
  pctinptbedsocc?: string;
  totalconfflunewadmped?: string;
  totalconfflunewadmadult?: string;
  totalconfc19hosppats?: string;
  totalconfrsvhosppats?: string;
  numconfflunewadmped0to4?: string;
  numconfflunewadmped5to17?: string;
  numconfflunewadmadult18to49?: string;
  numconfflunewadmadult50to64?: string;
  numconfflunewadmadult65to74?: string;
  numconfflunewadmadult75plus?: string;
};

export default function Dashboard() {
  // Separate state for chart (national data) and map (all states)
  const [nationalData, setNationalData] = useState<CDCData[]>([]);
  const [stateData, setStateData] = useState<CDCData[]>([]);
  const [wastewaterData, setWastewaterData] = useState<WastewaterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('12'); // 12 weeks by default
  const [mapMetric, setMapMetric] = useState<'patients' | 'admissions' | 'per100k' | 'wastewater'>('per100k');
  const [selectedState, setSelectedState] = useState<{ code: string; name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch national data for chart (USA only, 1 year = 52 weeks)
        const nationalResponse = await fetch('/api/cdc?jurisdiction=USA&limit=52');
        if (!nationalResponse.ok) {
          throw new Error('Failed to fetch national data');
        }
        const national = await nationalResponse.json();
        setNationalData(national);

        // Fetch all state data for map (limit 500 for ~7-8 weeks)
        const stateResponse = await fetch('/api/cdc?limit=500');
        if (!stateResponse.ok) {
          throw new Error('Failed to fetch state data');
        }
        const states = await stateResponse.json();
        setStateData(states);

        // Fetch wastewater surveillance data
        const wastewaterResponse = await fetch('/api/wastewater?limit=500');
        if (wastewaterResponse.ok) {
          const wastewater = await wastewaterResponse.json();
          setWastewaterData(wastewater);
        } else {
          console.warn('Wastewater data not available');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for charts - use nationalData (already filtered to USA)
  const filteredData = nationalData
    .sort((a, b) => new Date(a.weekendingdate).getTime() - new Date(b.weekendingdate).getTime())
    .slice(-parseInt(timeRange));

  const chartLabels = filteredData.map(item => format(new Date(item.weekendingdate), 'MMM d'));

  // Get latest data point for national data
  const latestData = nationalData[nationalData.length - 1];
  const previousWeekData = nationalData[nationalData.length - 2];

  // Calculate metrics for cards
  const calculateMetrics = () => {
    if (!latestData) return null;

    // Total Flu Patients
    const totalPatients = parseNumeric(latestData.totalconffluhosppats || '0');
    const prevTotalPatients = previousWeekData ? parseNumeric(previousWeekData.totalconffluhosppats || '0') : totalPatients;
    const patientsTrend = calculateWeekOverWeekChange(totalPatients, prevTotalPatients);

    // New Admissions
    const newAdmissions = parseNumeric(latestData.totalconfflunewadm || '0');
    const prevNewAdmissions = previousWeekData ? parseNumeric(previousWeekData.totalconfflunewadm || '0') : newAdmissions;
    const admissionsTrend = calculateWeekOverWeekChange(newAdmissions, prevNewAdmissions);

    // ICU Occupancy
    const icuPatients = parseNumeric(latestData.totalconffluicupats || '0');
    const icuOccupancy = parseNumeric(latestData.pcticubedsocc || '0') * 100;

    // Bed Utilization
    const bedUtilization = parseNumeric(latestData.pctinptbedsocc || '0') * 100;

    // Age Group Analysis
    const ageGroups = {
      '0-4': parseNumeric(latestData.numconfflunewadmped0to4 || '0'),
      '5-17': parseNumeric(latestData.numconfflunewadmped5to17 || '0'),
      '18-49': parseNumeric(latestData.numconfflunewadmadult18to49 || '0'),
      '50-64': parseNumeric(latestData.numconfflunewadmadult50to64 || '0'),
      '65-74': parseNumeric(latestData.numconfflunewadmadult65to74 || '0'),
      '75+': parseNumeric(latestData.numconfflunewadmadult75plus || '0'),
    };
    const dominantAgeGroup = getDominantCategory(ageGroups);

    // Multi-virus comparison
    const fluCount = totalPatients;
    const covidCount = parseNumeric(latestData.totalconfc19hosppats || '0');
    const rsvCount = parseNumeric(latestData.totalconfrsvhosppats || '0');
    const totalVirus = fluCount + covidCount + rsvCount;
    const fluPercentage = totalVirus > 0 ? (fluCount / totalVirus) * 100 : 0;

    return {
      totalPatients,
      patientsTrend: {
        value: patientsTrend,
        direction: getTrendDirection(patientsTrend),
      },
      newAdmissions,
      admissionsTrend: {
        value: admissionsTrend,
        direction: getTrendDirection(admissionsTrend),
      },
      icuPatients,
      icuOccupancy,
      bedUtilization,
      dominantAgeGroup,
      virusComparison: {
        flu: fluCount,
        covid: covidCount,
        rsv: rsvCount,
        fluPercentage,
      },
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-amber-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Influenza Surveillance Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time monitoring of influenza activity using CDC and Nextstrain data
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Metric Cards */}
            <div className="grid grid-cols-5 gap-4 mt-6">
              {/* Card 1: Total Flu Patients */}
              <MetricCard
                title="Flu Patients"
                value={metrics?.totalPatients.toLocaleString() || 'N/A'}
                subtitle={latestData ? `Week of ${format(new Date(latestData.weekendingdate), 'MMM d')}` : ''}
                color="blue"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              {/* Card 2: New Admissions */}
              <MetricCard
                title="New Admissions"
                value={metrics?.newAdmissions.toLocaleString() || 'N/A'}
                subtitle="This week"
                color="green"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />

              {/* Card 3: ICU Occupancy */}
              <MetricCard
                title="ICU Patients"
                value={metrics?.icuPatients.toLocaleString() || 'N/A'}
                subtitle="Flu in ICU"
                color="orange"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                }
              />

              {/* Card 4: Highest Risk Group */}
              <MetricCard
                title="Highest Risk Group"
                value={metrics?.dominantAgeGroup || 'N/A'}
                subtitle="Age group (years)"
                color="gray"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />

              {/* Card 5: Multi-Virus Comparison */}
              <MetricCard
                title="Flu vs Others"
                value={`${metrics?.virusComparison.fluPercentage.toFixed(0)}%` || 'N/A'}
                subtitle={`Flu: ${metrics?.virusComparison.flu || 0} | COVID: ${metrics?.virusComparison.covid || 0} | RSV: ${metrics?.virusComparison.rsv || 0}`}
                color="purple"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </div>

            {/* Main Chart - Enlarged */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Influenza Activity</h2>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="4">4 weeks</option>
                  <option value="8">8 weeks</option>
                  <option value="12">12 weeks</option>
                  <option value="24">24 weeks</option>
                  <option value="52">1 year</option>
                </select>
              </div>
              <div className="h-[700px]">
                <MultiLineChart data={filteredData} labels={chartLabels} />
              </div>
            </div>


            {/* Geographic Heat Map */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Geographic Distribution</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <FluMap
                    data={stateData}
                    wastewaterData={processWastewaterData(wastewaterData)}
                    metric={mapMetric}
                    onStateClick={(code, name) => setSelectedState({ code, name })}
                  />
                </div>
                <div className="lg:col-span-1 space-y-4">
                  <MapControls
                    metric={mapMetric}
                    onMetricChange={setMapMetric}
                  />
                  <MapLegend metric={mapMetric} />
                  {mapMetric === 'wastewater' && wastewaterData.length > 0 ? (
                    <WastewaterInfoPanel data={wastewaterData} />
                  ) : selectedState ? (
                    <StateDetailPanel
                      stateName={selectedState.name}
                      stateCode={selectedState.code}
                      data={
                        stateData
                          .filter(d => d.jurisdiction === selectedState.code)
                          .sort((a, b) => new Date(b.weekendingdate).getTime() - new Date(a.weekendingdate).getTime())[0] || null
                      }
                      onClose={() => setSelectedState(null)}
                    />
                  ) : null}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                {mapMetric === 'per100k' && 'Showing new flu admissions per 100,000 population by state.'}
                {mapMetric === 'admissions' && 'Showing total new flu admissions by state.'}
                {mapMetric === 'patients' && 'Showing total current flu patients by state.'}
                {mapMetric === 'wastewater' && 'Showing influenza A viral RNA concentration in wastewater by state (early warning indicator).'}
                {mapMetric !== 'wastewater' && ' Click on a state for details.'}
              </p>
            </div>

            {/* Additional Data Section */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Data</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Ending</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Patients</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Admissions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.slice(-10).reverse().map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {format(new Date(item.weekendingdate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalconffluhosppats || '0'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalconfflunewadm || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Data Source: CDC FluView | Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            This dashboard is for informational purposes only. Always refer to official health sources for critical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
