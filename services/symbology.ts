import { COLOR_PALETTES, DIVERGING_PALETTES, FEATURE_STYLE, SEQUENTIAL_PALETTES } from '../constants';
import {
  ClassificationMethod,
  FeatureProperties,
  GeoJSONData,
  NumericStats,
  Symbology,
} from '../types';

export const NO_DATA_LABEL = 'No data';

export interface LegendItem {
  label: string;
  color: string;
}

// Serializable description of how features are colored; also embedded in exported HTML
export type ColorScheme =
  | { type: 'categorical'; field: string; colors: Record<string, string> }
  | { type: 'classed'; field: string; breaks: number[]; colors: string[] };

/** Parses numbers and numeric strings (e.g. CSV cells); anything else is treated as no data. */
export const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
};

const statsOf = (sorted: number[]): NumericStats => {
  const mid = Math.floor(sorted.length / 2);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: sorted.reduce((sum, v) => sum + v, 0) / sorted.length,
    median: sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
  };
};

/**
 * Summary stats for fields where every non-empty value is numeric (and at least one value
 * exists). Fields that aren't numeric are left out.
 */
export const analyzeNumericFields = (
  data: GeoJSONData,
  fields: string[]
): Record<string, NumericStats> => {
  const stats: Record<string, NumericStats> = {};
  fields.forEach((field) => {
    const values: number[] = [];
    for (const feature of data.features) {
      const value = feature.properties?.[field];
      if (value === null || value === undefined || String(value).trim() === '') continue;
      const num = toNumber(value);
      if (num === null) return;
      values.push(num);
    }
    if (values.length > 0) stats[field] = statsOf(values.sort((a, b) => a - b));
  });
  return stats;
};

/** The value a diverging scheme splits at. */
export const resolveMidpoint = (symbology: Symbology, stats: NumericStats): number => {
  switch (symbology.midpoint) {
    case 'zero':
      return 0;
    case 'mean':
      return stats.mean;
    case 'custom':
      return Number.isFinite(symbology.customMidpoint) ? symbology.customMidpoint : stats.median;
    default:
      return stats.median;
  }
};

/**
 * Resolves a feature's color from a scheme. Must stay self-contained (no outside references)
 * because its source is embedded verbatim in exported HTML.
 */
export function resolveColor(
  scheme: ColorScheme | null,
  properties: FeatureProperties | null,
  fallback: { defaultColor: string; unmatchedColor: string }
): string {
  if (!scheme) return fallback.defaultColor;
  const value = properties ? properties[scheme.field] : undefined;

  if (scheme.type === 'categorical') {
    const key = value === undefined || value === null ? 'N/A' : String(value);
    return scheme.colors[key] || fallback.unmatchedColor;
  }

  let num: number | null = null;
  if (typeof value === 'number') num = value;
  else if (typeof value === 'string' && value.trim() !== '') num = Number(value);
  if (num === null || !Number.isFinite(num)) return fallback.unmatchedColor;

  // breaks are [min, upper1, upper2, ..., max]; each class includes its upper bound
  for (let i = 0; i < scheme.colors.length; i++) {
    if (num <= scheme.breaks[i + 1]) return scheme.colors[i];
  }
  return scheme.colors[scheme.colors.length - 1];
}

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const rgbToHex = (rgb: number[]) =>
  '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');

/** Interpolated color at position t (0–1) along a ramp. */
const colorAt = (stops: string[], t: number) => {
  const pos = t * (stops.length - 1);
  const lower = Math.floor(pos);
  const upper = Math.min(lower + 1, stops.length - 1);
  const frac = pos - lower;
  const a = hexToRgb(stops[lower]);
  const b = hexToRgb(stops[upper]);
  return rgbToHex(a.map((c, j) => c + (b[j] - c) * frac));
};

/** Samples `count` evenly spaced colors from a ramp, starting at `start` (0–1) to skip near-white ends. */
export const sampleRamp = (stops: string[], count: number, start = 0): string[] => {
  if (count === 1) return [stops[stops.length - 1]];
  return Array.from({ length: count }, (_, i) =>
    colorAt(stops, start + ((1 - start) * i) / (count - 1))
  );
};

/**
 * Colors for a diverging ramp: `below` classes from the low half and `above` classes from the
 * high half, each centered in its slot so neither the extremes nor the neutral middle is used.
 */
export const sampleDiverging = (stops: string[], below: number, above: number): string[] => [
  ...Array.from({ length: below }, (_, j) => colorAt(stops, (0.5 * (j + 0.5)) / below)),
  ...Array.from({ length: above }, (_, j) => colorAt(stops, 0.5 + (0.5 * (j + 0.5)) / above)),
];

const equalIntervalBreaks = (min: number, max: number, classes: number): number[] => {
  const step = (max - min) / classes;
  return Array.from({ length: classes + 1 }, (_, i) => (i === classes ? max : min + step * i));
};

const quantileBreaks = (sorted: number[], classes: number): number[] => {
  const breaks = [sorted[0]];
  for (let i = 1; i < classes; i++) {
    breaks.push(sorted[Math.ceil((i * sorted.length) / classes) - 1]);
  }
  breaks.push(sorted[sorted.length - 1]);
  return breaks;
};

// Jenks is O(n² · k), so large datasets are classified from an evenly spaced sample
const JENKS_MAX_SAMPLE = 1000;

const jenksBreaks = (sortedAll: number[], classes: number): number[] => {
  const step = Math.max(1, sortedAll.length / JENKS_MAX_SAMPLE);
  const data: number[] = [];
  for (let i = 0; i < sortedAll.length; i += step) data.push(sortedAll[Math.floor(i)]);
  if (data[data.length - 1] !== sortedAll[sortedAll.length - 1]) data.push(sortedAll[sortedAll.length - 1]);

  const n = data.length;
  // lowerClassLimits[i][j]: start index of the last class when splitting the first i values into j classes
  const lowerClassLimits = Array.from({ length: n + 1 }, () => new Array<number>(classes + 1).fill(0));
  const variance = Array.from({ length: n + 1 }, () => new Array<number>(classes + 1).fill(Infinity));
  for (let j = 1; j <= classes; j++) {
    lowerClassLimits[1][j] = 1;
    variance[1][j] = 0;
  }

  for (let l = 2; l <= n; l++) {
    let sum = 0;
    let sumSquares = 0;
    let w = 0;
    let v = 0;
    for (let m = 1; m <= l; m++) {
      const lowerIndex = l - m + 1;
      const value = data[lowerIndex - 1];
      w++;
      sum += value;
      sumSquares += value * value;
      v = sumSquares - (sum * sum) / w;
      if (lowerIndex > 1) {
        for (let j = 2; j <= classes; j++) {
          if (variance[l][j] >= v + variance[lowerIndex - 1][j - 1]) {
            lowerClassLimits[l][j] = lowerIndex;
            variance[l][j] = v + variance[lowerIndex - 1][j - 1];
          }
        }
      }
    }
    lowerClassLimits[l][1] = 1;
    variance[l][1] = v;
  }

  const breaks = new Array<number>(classes + 1);
  breaks[classes] = data[n - 1];
  breaks[0] = data[0];
  let k = n;
  for (let j = classes; j >= 2; j--) {
    const id = lowerClassLimits[k][j] - 2;
    breaks[j - 1] = data[id];
    k = lowerClassLimits[k][j] - 1;
  }
  return breaks;
};

/**
 * Class breaks [min, upper1, ..., max] for sorted values. `range` overrides the outer bounds,
 * e.g. so the classes on one side of a diverging midpoint end exactly at the midpoint.
 */
const computeBreaks = (
  sorted: number[],
  classes: number,
  method: ClassificationMethod,
  range: [number, number] = [sorted[0], sorted[sorted.length - 1]]
) => {
  const [min, max] = range;
  const uniqueCount = new Set(sorted).size;
  // Can't have more classes than distinct values
  const k = Math.max(1, Math.min(classes, uniqueCount));
  if (k === 1) return [min, max];

  const raw =
    method === 'equal'
      ? equalIntervalBreaks(min, max, k)
      : method === 'quantile'
        ? quantileBreaks(sorted, k)
        : jenksBreaks(sorted, k);
  raw[0] = min;
  raw[raw.length - 1] = max;

  // Drop duplicate upper bounds (e.g. quantiles over heavily repeated values). The first
  // class may end at the minimum itself, giving a class that holds only the minimum value.
  return raw.filter((b, i) => i <= 1 || b > raw[i - 1]);
};

const formatNumber = (value: number, span: number) => {
  const digits = span >= 100 ? 0 : span >= 1 ? 2 : 4;
  // Typographic minus sign, so negatives don't read as dashes
  return value.toLocaleString(undefined, { maximumFractionDigits: digits }).replace(/^-/, '−');
};

const sequentialClasses = (sorted: number[], symbology: Symbology) => {
  const breaks = computeBreaks(sorted, symbology.classes, symbology.method);
  const palette = SEQUENTIAL_PALETTES[symbology.sequentialPalette] || SEQUENTIAL_PALETTES.BLUES;
  const colors = sampleRamp(palette.stops, breaks.length - 1, palette.start);
  return { breaks, colors: symbology.reverse ? colors.reverse() : colors };
};

/**
 * Classifies values at or below the midpoint and values above it separately (half the classes
 * each), so a class boundary always falls exactly on the midpoint.
 */
const divergingClasses = (sorted: number[], symbology: Symbology) => {
  const midpoint = resolveMidpoint(symbology, statsOf(sorted));
  const perSide = Math.max(1, Math.floor(symbology.classes / 2));
  const below = sorted.filter((v) => v <= midpoint);
  const above = sorted.filter((v) => v > midpoint);

  // Each side ends at the midpoint, unless the other side is empty (then use the data's own extent)
  const belowBreaks = below.length
    ? computeBreaks(below, perSide, symbology.method, [
        below[0],
        above.length ? midpoint : below[below.length - 1],
      ])
    : [];
  const aboveBreaks = above.length
    ? computeBreaks(above, perSide, symbology.method, [
        below.length ? midpoint : above[0],
        above[above.length - 1],
      ])
    : [];

  const palette = DIVERGING_PALETTES[symbology.divergingPalette] || DIVERGING_PALETTES.RDBU;
  const stops = symbology.reverse ? [...palette.stops].reverse() : palette.stops;
  const belowCount = Math.max(0, belowBreaks.length - 1);
  const aboveCount = Math.max(0, aboveBreaks.length - 1);

  return {
    breaks: [...belowBreaks, ...aboveBreaks.slice(belowBreaks.length ? 1 : 0)],
    colors: sampleDiverging(stops, belowCount, aboveCount),
  };
};

export interface ColorSchemeResult {
  scheme: ColorScheme | null;
  legend: LegendItem[];
}

export const buildColorScheme = (data: GeoJSONData, symbology: Symbology): ColorSchemeResult => {
  const { field } = symbology;
  if (!field) return { scheme: null, legend: [] };

  if (symbology.mode === 'sequential' || symbology.mode === 'diverging') {
    const values: number[] = [];
    let hasNoData = false;
    data.features.forEach((f) => {
      const num = toNumber(f.properties?.[field]);
      if (num === null) hasNoData = true;
      else values.push(num);
    });

    if (values.length > 0) {
      values.sort((a, b) => a - b);
      const { breaks, colors } =
        symbology.mode === 'diverging'
          ? divergingClasses(values, symbology)
          : sequentialClasses(values, symbology);
      const span = breaks[breaks.length - 1] - breaks[0];

      // "to" reads better than a dash when negative numbers are involved ("−5 to −2")
      const separator = breaks[0] < 0 ? ' to ' : ' – ';
      const legend = colors.map((color, i) => ({
        color,
        label:
          breaks[i] === breaks[i + 1]
            ? formatNumber(breaks[i], span)
            : formatNumber(breaks[i], span) + separator + formatNumber(breaks[i + 1], span),
      }));
      if (hasNoData) legend.push({ label: NO_DATA_LABEL, color: FEATURE_STYLE.unmatchedColor });

      return { scheme: { type: 'classed', field, breaks, colors }, legend };
    }
    // No numeric values at all: fall through to unique values
  }

  const uniqueValues = new Set<string>();
  data.features.forEach((f) => {
    const val = f.properties?.[field];
    uniqueValues.add(val !== undefined && val !== null ? String(val) : 'N/A');
  });

  const palette = COLOR_PALETTES[symbology.categoricalPalette] || COLOR_PALETTES.VIBRANT;
  const colors: Record<string, string> = {};
  Array.from(uniqueValues)
    .sort()
    .forEach((val, index) => {
      colors[val] = palette[index % palette.length];
    });

  return {
    scheme: { type: 'categorical', field, colors },
    legend: Object.entries(colors).map(([label, color]) => ({ label, color })),
  };
};
