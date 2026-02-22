import { Basemap } from './types';

export const BASEMAPS: Record<string, Basemap> = {
  POSITRON: {
    name: 'CartoDB Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  OSM: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  IMAGERY: {
    name: 'World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
};

export const ACCEPTED_FILE_TYPES = {
  'application/json': ['.json', '.geojson'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
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
