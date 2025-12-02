'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import type { Layer } from 'leaflet';
import { getStateCode } from '@/lib/utils/stateCodes';
import { getColorForValue } from '@/lib/utils/mapColors';
import { parseNumeric } from '@/lib/utils/formatters';
import { ProcessedWastewaterData } from '@/types/wastewater';
import { getLatestWastewaterByState } from '@/lib/utils/wastewaterProcessing';
import 'leaflet/dist/leaflet.css';

interface FluMapProps {
  data: Array<{
    jurisdiction: string;
    totalconffluhosppats?: string;
    totalconfflunewadm?: string;
    totalconfflunewadmper100k?: string;
  }>;
  wastewaterData?: ProcessedWastewaterData[];
  metric?: 'patients' | 'admissions' | 'per100k' | 'wastewater';
  onStateClick?: (stateCode: string, stateName: string) => void;
}

export default function FluMap({ data, wastewaterData = [], metric = 'per100k', onStateClick }: FluMapProps) {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load GeoJSON data
  useEffect(() => {
    setIsClient(true);
    fetch('/geojson/us-states.json')
      .then(res => res.json())
      .then(setGeoData)
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  // Create wastewater data lookup
  const wastewaterByState = useMemo(() => {
    if (metric !== 'wastewater' || wastewaterData.length === 0) return new Map();
    return getLatestWastewaterByState(wastewaterData);
  }, [wastewaterData, metric]);

  // Create state data lookup
  const stateData = useMemo(() => {
    const lookup: Record<string, number> = {};

    if (metric === 'wastewater') {
      // Use wastewater data
      wastewaterByState.forEach((value, stateCode) => {
        lookup[stateCode] = value.viralConcentration;
      });
    } else {
      // Use clinical data
      data.forEach(item => {
        const code = item.jurisdiction;
        let value = 0;

        if (metric === 'patients') {
          value = parseNumeric(item.totalconffluhosppats || '0');
        } else if (metric === 'admissions') {
          value = parseNumeric(item.totalconfflunewadm || '0');
        } else {
          value = parseNumeric(item.totalconfflunewadmper100k || '0');
        }

        lookup[code] = value;
      });
    }

    return lookup;
  }, [data, metric, wastewaterByState]);

  // Style function for each state
  const getStateStyle = (feature?: Feature) => {
    const stateName = feature?.properties?.name;
    const stateCode = getStateCode(stateName);
    const value = stateCode ? stateData[stateCode] || 0 : 0;

    return {
      fillColor: getColorForValue(value, metric),
      fillOpacity: 0.7,
      color: '#374151',
      weight: 1,
    };
  };

  // Hover and click handlers
  const onEachFeature = (feature: Feature, layer: Layer) => {
    const stateName = feature.properties?.name;
    const stateCode = getStateCode(stateName);
    const value = stateCode ? stateData[stateCode] || 0 : 0;

    let metricLabel = '';
    let displayValue = '';

    if (metric === 'wastewater') {
      metricLabel = 'Viral Concentration';
      displayValue = value > 0 ? `${value.toFixed(0)} copies/L` : 'No data';
    } else if (metric === 'patients') {
      metricLabel = 'Hospital Patients';
      displayValue = value.toFixed(0);
    } else if (metric === 'admissions') {
      metricLabel = 'New Admissions';
      displayValue = value.toFixed(0);
    } else {
      metricLabel = 'Admissions per 100k';
      displayValue = value.toFixed(2);
    }

    layer.bindTooltip(
      `<strong>${stateName}</strong><br/>${metricLabel}: ${displayValue}`,
      {
        sticky: true,
      }
    );

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: '#1f2937',
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 1,
          color: '#374151',
          fillOpacity: 0.7,
        });
      },
      click: () => {
        if (onStateClick && stateCode) {
          onStateClick(stateCode, stateName);
        }
      },
    });
  };

  if (!isClient || !geoData) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geoData}
          style={getStateStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
