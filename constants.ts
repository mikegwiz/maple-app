import { Basemap } from './types';

const OPENFREEMAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';

export const BASEMAPS: Record<string, Basemap> = {
  // OpenFreeMap vector styles: open, keyless, and no Referer requirement,
  // so they also load in exported HTML opened from the local filesystem.
  POSITRON: {
    name: 'Positron',
    type: 'vector',
    url: 'https://tiles.openfreemap.org/styles/positron',
    attribution: OPENFREEMAP_ATTRIBUTION,
  },
  OSM: {
    name: 'Liberty',
    type: 'vector',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    attribution: OPENFREEMAP_ATTRIBUTION,
  },
  IMAGERY: {
    name: 'World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
};

// Feature styling shared by the in-app map and the exported HTML
export const FEATURE_STYLE = {
  defaultColor: '#059669', // emerald-600, used when no color field is set
  unmatchedColor: '#94a3b8', // slate-400, for values missing from the color mapping
  point: { radius: 8, color: '#000', weight: 1, opacity: 1, fillOpacity: 0.8 },
  shape: { weight: 1.5, opacity: 1, color: '#000', fillOpacity: 0.7 },
};

export const COLOR_PALETTES: Record<string, string[]> = {
  // Ordered for maximum contrast: Red, Blue, Green, Orange, Purple, Cyan, Pink, Yellow
  VIBRANT: ['#ef4444', '#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4', '#d946ef', '#eab308'],
  // Ordered for maximum contrast: Red, Blue, Green, Orange, Purple, Cyan, Pink, Yellow (Pastel versions)
  PASTEL: ['#fca5a5', '#93c5fd', '#86efac', '#fdba74', '#c4b5fd', '#67e8f9', '#f0abfc', '#fde047'],
  // Ordered for maximum contrast: Red, Blue, Green, Orange, Purple, Teal, Pink, Gray
  DARK: ['#b91c1c', '#1d4ed8', '#15803d', '#c2410c', '#7e22ce', '#0f766e', '#be185d', '#374151'],
  // Ordered for maximum contrast: Sienna, SteelBlue, ForestGreen, GoldenRod, SlateGray, SaddleBrown, IndianRed, OliveDrab
  EARTH: ['#a0522d', '#4682b4', '#228b22', '#daa520', '#708090', '#8b4513', '#cd5c5c', '#556b2f'],
};
