import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { GeoJSONData, GeoJSONFeature } from '../types';

export interface ParsedDataResult {
  data: GeoJSONData;
  detectedLat?: string;
  detectedLon?: string;
}

export const parseFile = async (file: File): Promise<ParsedDataResult> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'json' || extension === 'geojson') {
    return parseGeoJSON(file);
  } else if (extension === 'csv') {
    return parseCSV(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  } else {
    throw new Error('Unsupported file type');
  }
};

const parseGeoJSON = (file: File): Promise<ParsedDataResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        // Scenario 1: Standard GeoJSON
        if (json.type === 'FeatureCollection' || json.type === 'Feature') {
          const data =
            json.type === 'Feature' ? { type: 'FeatureCollection', features: [json] } : json;
          resolve({
            data,
            detectedLat: 'Geometry Object',
            detectedLon: 'Geometry Object',
          });
        }
        // Scenario 2: Generic JSON Array (e.g. from an API dump)
        else if (Array.isArray(json)) {
          try {
            const result = rowsToGeoJSON(json);
            resolve(result);
          } catch (rowError) {
            reject(
              new Error(
                'JSON array must contain objects with valid latitude/longitude fields (e.g. lat/lon).'
              )
            );
          }
        } else {
          reject(
            new Error(
              'Invalid JSON format. Must be standard GeoJSON or an array of objects with coordinates.'
            )
          );
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

const isValidLat = (val: any) => {
  if (val === null || val === undefined || String(val).trim() === '') return false;
  const num = Number(val);
  return !isNaN(num) && num >= -90 && num <= 90;
};

const isValidLon = (val: any) => {
  if (val === null || val === undefined || String(val).trim() === '') return false;
  const num = Number(val);
  return !isNaN(num) && num >= -180 && num <= 180;
};

const detectCoordinateColumns = (rows: any[]): { latKey?: string; lonKey?: string } => {
  if (!rows || rows.length === 0) return {};

  const headers = Object.keys(rows[0]);
  const sample = rows.slice(0, 50); // Check first 50 rows for validation

  // Regex to identify potential columns
  const latRegex = /lat|^(y)$|(_y)$|^(y_)/i;
  const lonRegex = /lon|lng|^(x)$|(_x)$|^(x_)/i;

  let latCandidates = headers.filter((h) => latRegex.test(h));
  let lonCandidates = headers.filter((h) => lonRegex.test(h));

  const validate = (key: string, checker: (v: any) => boolean) => {
    let hasValidData = false;
    for (const row of sample) {
      const val = row[key];
      if (val === null || val === undefined || String(val).trim() === '') continue;
      if (!checker(val)) return false;
      hasValidData = true;
    }
    return hasValidData;
  };

  latCandidates = latCandidates.filter((c) => validate(c, isValidLat));
  lonCandidates = lonCandidates.filter((c) => validate(c, isValidLon));

  const score = (key: string, type: 'lat' | 'lon') => {
    const k = key.toLowerCase();
    if (type === 'lat') {
      if (['lat', 'latitude'].includes(k)) return 3;
      if (k === 'y') return 2;
      return 1;
    } else {
      if (['lon', 'lng', 'longitude'].includes(k)) return 3;
      if (k === 'x') return 2;
      return 1;
    }
  };

  latCandidates.sort((a, b) => score(b, 'lat') - score(a, 'lat'));
  lonCandidates.sort((a, b) => score(b, 'lon') - score(a, 'lon'));

  return {
    latKey: latCandidates[0],
    lonKey: lonCandidates[0],
  };
};

const rowsToGeoJSON = (rows: any[]): ParsedDataResult => {
  const { latKey, lonKey } = detectCoordinateColumns(rows);

  if (!latKey || !lonKey) {
    throw new Error(
      'No valid latitude/longitude columns found. Columns must be named like "lat", "lon", "x", "y" and contain valid numeric coordinates (Lat: +/-90, Lon: +/-180).'
    );
  }

  const features: GeoJSONFeature[] = [];

  rows.forEach((row) => {
    const lat = parseFloat(row[latKey]);
    const lon = parseFloat(row[lonKey]);

    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: row,
      });
    }
  });

  if (features.length === 0) {
    throw new Error('No valid rows found with coordinates within acceptable ranges.');
  }

  return {
    data: {
      type: 'FeatureCollection',
      features,
    },
    detectedLat: latKey,
    detectedLon: lonKey,
  };
};

const parseCSV = (file: File): Promise<ParsedDataResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const result = rowsToGeoJSON(results.data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      },
      error: (error: any) => reject(error),
    });
  });
};

const parseExcel = (file: File): Promise<ParsedDataResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        const result = rowsToGeoJSON(json);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Excel file'));
    reader.readAsArrayBuffer(file);
  });
};
