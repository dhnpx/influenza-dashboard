'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import type { Layer } from 'leaflet';
import { getStateCode } from '@/lib/utils/stateCodes';
import { getColorForValue } from '@/lib/utils/mapColors';
import { parseNumeric } from '@/lib/utils/formatters';
import 'leaflet/dist/leaflet.css';

interface FluMapProps {
  data: Array<{
    jurisdiction: string;
    totalconffluhosppats?: string;
    totalconfflunewadm?: string;
    totalconfflunewadmper100k?: string;
  }>;
  metric?: 'patients' | 'admissions' | 'per100k';
}

export default function FluMap({ data, metric = 'per100k' }: FluMapProps) {
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

  // Create state data lookup
  const stateData = useMemo(() => {
    const lookup: Record<string, number> = {};

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

    return lookup;
  }, [data, metric]);

  // Style function for each state
  const getStateStyle = (feature?: Feature) => {
    const stateName = feature?.properties?.name;
    const stateCode = getStateCode(stateName);
    const value = stateCode ? stateData[stateCode] || 0 : 0;

    return {
      fillColor: getColorForValue(value),
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

    const metricLabel =
      metric === 'patients'
        ? 'Hospital Patients'
        : metric === 'admissions'
        ? 'New Admissions'
        : 'Admissions per 100k';

    layer.bindTooltip(
      `<strong>${stateName}</strong><br/>${metricLabel}: ${value.toFixed(2)}`,
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
    });
  };

  if (!isClient || !geoData) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
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
