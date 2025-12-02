'use client';

import { Line } from 'react-chartjs-2';
import { useState } from 'react';

type DataPoint = {
  weekendingdate: string;
  totalconffluhosppats?: string;
  totalconfflunewadm?: string;
  totalconffluicupats?: string;
  totalconfc19hosppats?: string;
  totalconfrsvhosppats?: string;
};

type MultiLineChartProps = {
  data: DataPoint[];
  labels: string[];
};

export default function MultiLineChart({ data, labels }: MultiLineChartProps) {
  // Flu metrics - default enabled
  const [showHospitalPatients, setShowHospitalPatients] = useState(true);
  const [showNewAdmissions, setShowNewAdmissions] = useState(false);
  const [showICU, setShowICU] = useState(false);

  // Comparison metrics - default disabled
  const [showCOVID, setShowCOVID] = useState(false);
  const [showRSV, setShowRSV] = useState(false);

  // Build datasets based on toggles
  const datasets = [];

  if (showHospitalPatients) {
    datasets.push({
      label: 'Flu Hospital Patients',
      data: data.map(item => parseFloat(item.totalconffluhosppats || '0')),
      borderColor: 'rgb(59, 130, 246)', // Blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    });
  }

  if (showNewAdmissions) {
    datasets.push({
      label: 'New Admissions',
      data: data.map(item => parseFloat(item.totalconfflunewadm || '0')),
      borderColor: 'rgb(34, 197, 94)', // Green
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(34, 197, 94)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    });
  }

  if (showICU) {
    datasets.push({
      label: 'ICU Patients',
      data: data.map(item => parseFloat(item.totalconffluicupats || '0')),
      borderColor: 'rgb(249, 115, 22)', // Orange
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(249, 115, 22)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    });
  }

  if (showCOVID) {
    datasets.push({
      label: 'COVID-19 Patients',
      data: data.map(item => parseFloat(item.totalconfc19hosppats || '0')),
      borderColor: 'rgb(139, 92, 246)', // Purple
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: false,
      borderDash: [5, 5], // Dashed line
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(139, 92, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    });
  }

  if (showRSV) {
    datasets.push({
      label: 'RSV Patients',
      data: data.map(item => parseFloat(item.totalconfrsvhosppats || '0')),
      borderColor: 'rgb(236, 72, 153)', // Pink
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      tension: 0.4,
      fill: false,
      borderDash: [10, 5], // Different dash pattern
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(236, 72, 153)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: true,
        labels: {
          font: {
            size: 14,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Patients',
          font: {
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Week Ending',
          font: {
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toggle Controls */}
      <div className="flex flex-wrap gap-6 pb-4 border-b border-gray-200 flex-shrink-0">
        {/* Flu Metrics Section */}
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Flu Metrics</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHospitalPatients}
                onChange={(e) => setShowHospitalPatients(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="flex items-center text-sm text-gray-700">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Hospital Patients
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showNewAdmissions}
                onChange={(e) => setShowNewAdmissions(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="flex items-center text-sm text-gray-700">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                New Admissions
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showICU}
                onChange={(e) => setShowICU(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="flex items-center text-sm text-gray-700">
                <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                ICU Patients
              </span>
            </label>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Compare With</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCOVID}
                onChange={(e) => setShowCOVID(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="flex items-center text-sm text-gray-700">
                <span className="w-3 h-0.5 bg-purple-500 mr-2" style={{ width: '12px', borderTop: '2px dashed' }}></span>
                COVID-19
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRSV}
                onChange={(e) => setShowRSV(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span className="flex items-center text-sm text-gray-700">
                <span className="w-3 h-0.5 bg-pink-500 mr-2" style={{ width: '12px', borderTop: '2px dashed' }}></span>
                RSV
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 mt-4">
        {datasets.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select at least one metric to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
