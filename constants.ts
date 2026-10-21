import { Basemap, ClassificationMethod, MidpointMode, Symbology } from './types';

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

// Sequential ramps for graduated colors (ColorBrewer 9-class schemes, plus viridis).
// `start` skips the palest end of a ramp so low-value features stay visible on light basemaps.
export const SEQUENTIAL_PALETTES: Record<string, { label: string; stops: string[]; start: number }> = {
  BLUES: {
    label: 'Blues',
    stops: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    start: 0.15,
  },
  GREENS: {
    label: 'Greens',
    stops: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    start: 0.15,
  },
  ORANGES: {
    label: 'Oranges',
    stops: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    start: 0.15,
  },
  REDS: {
    label: 'Reds',
    stops: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    start: 0.15,
  },
  PURPLES: {
    label: 'Purples',
    stops: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    start: 0.15,
  },
  YLORRD: {
    label: 'Yellow–Orange–Red',
    stops: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    start: 0.1,
  },
  YLGNBU: {
    label: 'Yellow–Green–Blue',
    stops: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    start: 0.1,
  },
  VIRIDIS: {
    label: 'Viridis',
    stops: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
    start: 0,
  },
};

// Diverging ramps (ColorBrewer 11-class schemes), low end first
export const DIVERGING_PALETTES: Record<string, { label: string; stops: string[] }> = {
  RDBU: {
    label: 'Red–Blue',
    stops: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
  },
  RDYLBU: {
    label: 'Red–Yellow–Blue',
    stops: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
  },
  RDYLGN: {
    label: 'Red–Yellow–Green',
    stops: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
  },
  SPECTRAL: {
    label: 'Spectral',
    stops: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
  },
  BRBG: {
    label: 'Brown–Teal',
    stops: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
  },
  PIYG: {
    label: 'Pink–Green',
    stops: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
  },
  PRGN: {
    label: 'Purple–Green',
    stops: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
  },
  PUOR: {
    label: 'Orange–Purple',
    stops: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
  },
};

export const MIDPOINT_OPTIONS: Record<MidpointMode, string> = {
  zero: 'Zero',
  mean: 'Mean',
  median: 'Median',
  custom: 'Custom value',
};

// Diverging schemes split classes evenly around the midpoint, so they use even class counts
export const DIVERGING_CLASS_OPTIONS = [4, 6, 8];

export const CLASSIFICATION_METHODS: Record<ClassificationMethod, string> = {
  jenks: 'Natural breaks (Jenks)',
  quantile: 'Quantile',
  equal: 'Equal interval',
};

export const MIN_CLASSES = 3;
export const MAX_CLASSES = 7;

export const DEFAULT_SYMBOLOGY: Symbology = {
  field: null,
  mode: 'categorical',
  categoricalPalette: 'VIBRANT',
  sequentialPalette: 'BLUES',
  divergingPalette: 'RDBU',
  classes: 5,
  method: 'jenks',
  midpoint: 'median',
  customMidpoint: 0,
  reverse: false,
};
