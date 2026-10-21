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
  colorField?: string | null;
  colorPalette?: string;
}

export interface Basemap {
  name: string;
  // 'vector' basemaps use a MapLibre style URL; default is a raster tile URL template
  type?: 'raster' | 'vector';
  url: string;
  attribution: string;
}
