export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: Record<string, any>;
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export enum AppStep {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  CONFIG = 'CONFIG',
  MAP = 'MAP',
}

export interface AppState {
  step: AppStep;
  data: GeoJSONData | null;
  filename: string;
  availableFields: string[];
  selectedFields: string[];
  mapTitle: string;
  colorField?: string | null;
  colorPalette?: string;
}

export interface Basemap {
  name: string;
  url: string;
  attribution: string;
}
