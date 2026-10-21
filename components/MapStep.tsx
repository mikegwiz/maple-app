import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Download, ArrowLeft, Layers, List, Info, ShieldAlert } from 'lucide-react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';

import { BASEMAPS, FEATURE_STYLE } from '../constants';
import { Button } from './Button';
import { generateMapHTML } from '../services/exportUtils';
import { buildColorScheme, resolveColor } from '../services/symbology';
import { GeoJSONData, GeoJSONFeature, Basemap, Symbology } from '../types';


import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Fix for Leaflet default icon issues in bundlers
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapStepProps {
  data: GeoJSONData;
  title: string;
  selectedFields: string[];
  symbology: Symbology;
  onBack: () => void;
}

// Renders a MapLibre vector style as a Leaflet layer
const VectorBasemapLayer: React.FC<{ basemap: Basemap }> = ({ basemap }) => {
  const map = useMap();

  useEffect(() => {
    const layer = maplibreGL({
      style: basemap.url,
      attributionControl: { customAttribution: basemap.attribution },
    }).addTo(map);
    return () => {
      layer.remove();
    };
  }, [map, basemap]);

  return null;
};

// Component to handle auto-zoom to data extent, using the already-rendered data layer
const MapBoundsInfo: React.FC<{ data: GeoJSONData; layerRef: React.RefObject<L.GeoJSON> }> = ({
  data,
  layerRef,
}) => {
  const map = useMap();

  useEffect(() => {
    if (data && map) {
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
          const bounds = layerRef.current?.getBounds();
          if (bounds?.isValid()) {
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 16,
              animate: false,
            });
          }
        } catch (e) {
          console.error('Could not calculate bounds', e);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [data, map, layerRef]);

  return null;
};

export const MapStep: React.FC<MapStepProps> = ({
  data,
  title,
  selectedFields,
  symbology,
  onBack,
}) => {
  const [activeBasemapKey, setActiveBasemapKey] = useState<string>('POSITRON');
  const [showLegend, setShowLegend] = useState(true);
  const [showExportWarning, setShowExportWarning] = useState(false);
  const activeBasemap = BASEMAPS[activeBasemapKey];
  const geoJsonRef = useRef<L.GeoJSON>(null);

  const { scheme, legend } = useMemo(() => buildColorScheme(data, symbology), [data, symbology]);

  const initiateExport = () => {
    setShowExportWarning(true);
  };

  const executeExport = () => {
    const htmlContent = generateMapHTML(
      title,
      data,
      selectedFields,
      activeBasemap,
      scheme,
      legend
    );
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportWarning(false);
  };

  const getFeatureColor = (feature?: GeoJSONFeature) =>
    resolveColor(scheme, feature?.properties ?? null, FEATURE_STYLE);

  const onEachFeature = (feature: GeoJSONFeature, layer: L.Layer) => {
    if (feature.properties) {
      const color = getFeatureColor(feature);
      const content = document.createElement('div');
      content.className = 'min-w-[200px] max-w-[300px] font-sans';

      const wrapper = document.createElement('div');
      wrapper.className = 'flex gap-3';

      const strip = document.createElement('div');
      strip.className = 'w-1.5 rounded-full flex-shrink-0 opacity-80 mt-1 mb-1';
      strip.style.backgroundColor = color;

      const list = document.createElement('div');
      list.className = 'flex-1 space-y-2 py-1';

      let hasContent = false;
      selectedFields.forEach((field) => {
        const val = feature.properties[field];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          hasContent = true;
          const item = document.createElement('div');
          item.className =
            'flex flex-col gap-0.5 border-b border-slate-100 pb-2 last:border-0 last:pb-0';

          const label = document.createElement('span');
          label.className =
            'text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none';
          label.textContent = field;

          const valueSpan = document.createElement('span');
          valueSpan.className = 'text-sm text-slate-700 font-medium leading-tight break-words';
          valueSpan.textContent = String(val);

          item.appendChild(label);
          item.appendChild(valueSpan);
          list.appendChild(item);
        }
      });

      if (!hasContent) {
        const emptyMsg = document.createElement('span');
        emptyMsg.className = 'text-xs text-slate-400 italic';
        emptyMsg.textContent = 'No details available';
        list.appendChild(emptyMsg);
      }

      wrapper.appendChild(strip);
      wrapper.appendChild(list);
      content.appendChild(wrapper);

      layer.bindPopup(content);
    }
  };

  const pointToLayer = (feature: GeoJSONFeature, latlng: L.LatLng) => {
    if (scheme) {
      return L.circleMarker(latlng, { ...FEATURE_STYLE.point, fillColor: getFeatureColor(feature) });
    }
    return L.marker(latlng);
  };

  const style = (feature?: GeoJSONFeature) => {
    return { ...FEATURE_STYLE.shape, fillColor: getFeatureColor(feature) };
  };

  return (
    <div className="flex flex-col h-screen max-h-screen relative">
      {/* Export Warning Modal */}
      {showExportWarning && (
        <div className="fixed inset-0 z-[1100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-600 flex-shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900">Security Warning</h3>
                <p className="text-amber-800 text-sm mt-1">Please read before exporting</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">
                The exported HTML file contains{' '}
                <strong>all your data embedded directly within it</strong> (including specific
                coordinates and attributes), even if fields are hidden in the popup.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                <strong className="block text-slate-800 mb-1">Recommendation:</strong>
                This file is as confidential as your original input file. Treat it with the same
                security protocols (e.g. do not email unencrypted, do not host publicly) unless the
                data is approved for public release.
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowExportWarning(false)}>
                Cancel
              </Button>
              <Button
                onClick={executeExport}
                className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-md shadow-amber-600/20"
              >
                I Understand, Export
              </Button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 truncate max-w-md" title={title}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <div className="hidden md:flex bg-slate-100 rounded-lg p-1 gap-1">
              {Object.entries(BASEMAPS).map(([key, map]) => (
                <button
                  key={key}
                  onClick={() => setActiveBasemapKey(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeBasemapKey === key
                      ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {map.name}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
              <Info className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                All basemaps included in export. Selected is default.
              </span>
            </div>
          </div>
          <Button onClick={initiateExport} className="shadow-lg shadow-emerald-600/20">
            <Download className="w-4 h-4" /> Export HTML
          </Button>
        </div>
      </header>

      <div className="flex-1 relative bg-slate-50 overflow-hidden">
        {/* Legend */}
        {scheme && (
          <div
            className={`absolute bottom-8 left-8 z-[1000] bg-white rounded-lg shadow-lg border border-slate-200 max-h-[40vh] overflow-y-auto transition-all duration-300 ${showLegend ? 'w-64' : 'w-auto'}`}
          >
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0">
              {showLegend && (
                <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider truncate mr-2">
                  {scheme.field}
                </h4>
              )}
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="p-1 hover:bg-slate-200 rounded text-slate-500"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {showLegend && (
              <div className="p-3 space-y-2">
                {legend.map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full shadow-sm flex-shrink-0 border border-black/10"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="text-sm text-slate-700 truncate">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Basemap Switcher (absolute) */}
        <div className="md:hidden absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
          <Layers className="w-6 h-6 text-slate-600" />
          <select
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={activeBasemapKey}
            onChange={(e) => setActiveBasemapKey(e.target.value)}
          >
            {Object.entries(BASEMAPS).map(([key, map]) => (
              <option key={key} value={key}>
                {map.name}
              </option>
            ))}
          </select>
        </div>

        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {activeBasemap.type === 'vector' ? (
            <VectorBasemapLayer key={activeBasemapKey} basemap={activeBasemap} />
          ) : (
            <TileLayer
              key={activeBasemapKey}
              attribution={activeBasemap.attribution}
              url={activeBasemap.url}
            />
          )}
          <GeoJSON
            ref={geoJsonRef}
            data={data}
            onEachFeature={onEachFeature}
            pointToLayer={pointToLayer}
            style={style}
            key={JSON.stringify([selectedFields, symbology])} // Force re-render if styling changes
          />
          <MapBoundsInfo data={data} layerRef={geoJsonRef} />
        </MapContainer>
      </div>
    </div>
  );
};
