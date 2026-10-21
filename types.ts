import type { Feature, FeatureCollection, Geometry } from 'geojson';

export type FeatureProperties = Record<string, unknown>;
export type GeoJSONFeature = Feature<Geometry, FeatureProperties>;
export type GeoJSONData = FeatureCollection<Geometry, FeatureProperties>;

export enum AppStep {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  CONFIG = 'CONFIG',
  MAP = 'MAP',
}

export interface AppState {
  step: AppStep;
  data: GeoJSONData | null;
  availableFields: string[];
  selectedFields: string[];
  mapTitle: string;
  numericStats: Record<string, NumericStats>;
  symbology: Symbology;
}

// 'categorical' colors each unique value; 'sequential' colors numeric ranges along a ramp;
// 'diverging' colors numeric ranges outward from a midpoint
export type ColorMode = 'categorical' | 'sequential' | 'diverging';
export type ClassificationMethod = 'jenks' | 'quantile' | 'equal';
export type MidpointMode = 'zero' | 'mean' | 'median' | 'custom';

export interface NumericStats {
  min: number;
  max: number;
  mean: number;
  median: number;
}

export interface Symbology {
  field: string | null;
  mode: ColorMode;
  categoricalPalette: string;
  sequentialPalette: string;
  divergingPalette: string;
  classes: number;
  method: ClassificationMethod;
  midpoint: MidpointMode;
  customMidpoint: number;
  reverse: boolean;
}

export interface Basemap {
  name: string;
  // 'vector' basemaps use a MapLibre style URL; default is a raster tile URL template
  type?: 'raster' | 'vector';
  url: string;
  attribution: string;
}
