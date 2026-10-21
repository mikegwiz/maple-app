import { Palette } from 'lucide-react';
import React, { useState } from 'react';

import {
  CLASSIFICATION_METHODS,
  COLOR_PALETTES,
  DIVERGING_CLASS_OPTIONS,
  DIVERGING_PALETTES,
  MAX_CLASSES,
  MIDPOINT_OPTIONS,
  MIN_CLASSES,
  SEQUENTIAL_PALETTES,
} from '../../constants';
import { resolveMidpoint, sampleDiverging, sampleRamp } from '../../services/symbology';
import { ClassificationMethod, ColorMode, MidpointMode, NumericStats, Symbology } from '../../types';

interface SymbologySettingsProps {
  symbology: Symbology;
  onChange: (symbology: Symbology) => void;
  availableFields: string[];
  numericStats: Record<string, NumericStats>;
}

const selectClass =
  'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white cursor-pointer';
const subLabelClass = 'block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide';

const Swatches: React.FC<{ colors: string[] }> = ({ colors }) => (
  <div className="flex gap-0.5 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
    {colors.map((color, i) => (
      <div key={i} className="flex-1" style={{ backgroundColor: color }} />
    ))}
  </div>
);

const MODES: { mode: ColorMode; label: string }[] = [
  { mode: 'categorical', label: 'Unique values' },
  { mode: 'sequential', label: 'Graduated' },
  { mode: 'diverging', label: 'Diverging' },
];

const formatValue = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 4 });

/** Adjusts class count and midpoint so they're valid for the given mode and field. */
const normalize = (
  symbology: Symbology,
  stats: NumericStats | undefined,
  modeChanged: boolean
): Symbology => {
  const next = { ...symbology };
  if (next.mode === 'diverging') {
    if (next.classes % 2) next.classes += 1;
    next.classes = Math.min(
      Math.max(next.classes, DIVERGING_CLASS_OPTIONS[0]),
      DIVERGING_CLASS_OPTIONS[DIVERGING_CLASS_OPTIONS.length - 1]
    );
    // Default to splitting at zero when the data crosses it, otherwise at the median
    if (modeChanged && stats) next.midpoint = stats.min < 0 && stats.max > 0 ? 'zero' : 'median';
  } else {
    next.classes = Math.min(Math.max(next.classes, MIN_CLASSES), MAX_CLASSES);
  }
  return next;
};

export const SymbologySettings: React.FC<SymbologySettingsProps> = ({
  symbology,
  onChange,
  availableFields,
  numericStats,
}) => {
  const stats = symbology.field ? numericStats[symbology.field] : undefined;
  const isNumeric = !!stats;
  const mode: ColorMode = isNumeric ? symbology.mode : 'categorical';
  // Kept as text so partial input like "-" or "1." isn't lost while typing
  const [customMidpointText, setCustomMidpointText] = useState(String(symbology.customMidpoint));

  const update = (changes: Partial<Symbology>) => onChange({ ...symbology, ...changes });

  const handleFieldChange = (field: string) => {
    const fieldStats = numericStats[field];
    // Numeric fields keep a diverging style if chosen, otherwise default to graduated
    const nextMode: ColorMode = fieldStats
      ? symbology.mode === 'diverging'
        ? 'diverging'
        : 'sequential'
      : 'categorical';
    onChange(normalize({ ...symbology, field: field || null, mode: nextMode }, fieldStats, true));
  };

  const handleModeChange = (nextMode: ColorMode) =>
    onChange(normalize({ ...symbology, mode: nextMode }, stats, nextMode !== symbology.mode));

  const handleMidpointChange = (midpoint: MidpointMode) => {
    if (midpoint === 'custom' && stats) {
      // Start the custom value from the midpoint currently in use
      const current = Math.round(resolveMidpoint(symbology, stats) * 1e4) / 1e4;
      setCustomMidpointText(String(current));
      update({ midpoint, customMidpoint: current });
    } else {
      update({ midpoint });
    }
  };

  const handleCustomMidpointChange = (text: string) => {
    setCustomMidpointText(text);
    update({ customMidpoint: text.trim() === '' ? NaN : Number(text) });
  };

  const isDiverging = mode === 'diverging';
  const sequential = SEQUENTIAL_PALETTES[symbology.sequentialPalette];
  const diverging = DIVERGING_PALETTES[symbology.divergingPalette];
  const previewColors = isDiverging
    ? sampleDiverging(
        symbology.reverse ? [...diverging.stops].reverse() : diverging.stops,
        symbology.classes / 2,
        symbology.classes / 2
      )
    : (() => {
        const colors = sampleRamp(sequential.stops, symbology.classes, sequential.start);
        return symbology.reverse ? colors.reverse() : colors;
      })();
  const classOptions = isDiverging
    ? DIVERGING_CLASS_OPTIONS
    : Array.from({ length: MAX_CLASSES - MIN_CLASSES + 1 }, (_, i) => MIN_CLASSES + i);

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="color-field"
          className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"
        >
          <Palette className="w-3.5 h-3.5 text-emerald-600" />
          Color Features By
        </label>
        <select
          id="color-field"
          value={symbology.field ?? ''}
          onChange={(e) => handleFieldChange(e.target.value)}
          className={`${selectClass} px-4 py-2.5 text-base`}
        >
          <option value="">None (Single Color)</option>
          {availableFields.map((field) => (
            <option key={field} value={field}>
              {field}
              {numericStats[field] ? ' (numeric)' : ''}
            </option>
          ))}
        </select>
      </div>

      {symbology.field && (
        <>
          <div>
            <span className={subLabelClass}>Style</span>
            <div className="grid grid-cols-3 bg-slate-100 rounded-lg p-1 gap-1" role="radiogroup">
              {MODES.map(({ mode: option, label }) => {
                const disabled = option !== 'categorical' && !isNumeric;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={mode === option}
                    disabled={disabled}
                    title={disabled ? `${label} colors need a numeric field` : undefined}
                    onClick={() => handleModeChange(option)}
                    className={`px-2 py-1.5 text-sm font-medium rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      mode === option
                        ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {mode === 'categorical' ? (
            <div>
              <label htmlFor="palette" className={subLabelClass}>
                Palette Scheme
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  id="palette"
                  value={symbology.categoricalPalette}
                  onChange={(e) => update({ categoricalPalette: e.target.value })}
                  className={selectClass}
                >
                  {Object.keys(COLOR_PALETTES).map((key) => (
                    <option key={key} value={key}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <Swatches colors={COLOR_PALETTES[symbology.categoricalPalette]} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="color-ramp" className={`${subLabelClass} mb-0`}>
                    Color Ramp
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={symbology.reverse}
                      onChange={(e) => update({ reverse: e.target.checked })}
                      className="accent-emerald-600"
                    />
                    Reverse
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    id="color-ramp"
                    value={isDiverging ? symbology.divergingPalette : symbology.sequentialPalette}
                    onChange={(e) =>
                      update(
                        isDiverging
                          ? { divergingPalette: e.target.value }
                          : { sequentialPalette: e.target.value }
                      )
                    }
                    className={selectClass}
                  >
                    {Object.entries(isDiverging ? DIVERGING_PALETTES : SEQUENTIAL_PALETTES).map(
                      ([key, palette]) => (
                        <option key={key} value={key}>
                          {palette.label}
                        </option>
                      )
                    )}
                  </select>
                  <Swatches colors={previewColors} />
                </div>
              </div>

              {isDiverging && stats && (
                <div>
                  <label htmlFor="midpoint" className={subLabelClass}>
                    Midpoint
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      id="midpoint"
                      value={symbology.midpoint}
                      onChange={(e) => handleMidpointChange(e.target.value as MidpointMode)}
                      className={selectClass}
                    >
                      {Object.entries(MIDPOINT_OPTIONS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {symbology.midpoint === 'custom' ? (
                      <input
                        type="number"
                        aria-label="Custom midpoint value"
                        value={customMidpointText}
                        onChange={(e) => handleCustomMidpointChange(e.target.value)}
                        className={selectClass}
                      />
                    ) : (
                      <p className="self-center text-sm text-slate-600">
                        Splits at{' '}
                        <strong>{formatValue(resolveMidpoint(symbology, stats))}</strong>
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Data range: {formatValue(stats.min)} to {formatValue(stats.max)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="classification" className={subLabelClass}>
                    Classification
                  </label>
                  <select
                    id="classification"
                    value={symbology.method}
                    onChange={(e) => update({ method: e.target.value as ClassificationMethod })}
                    className={selectClass}
                  >
                    {Object.entries(CLASSIFICATION_METHODS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="classes" className={subLabelClass}>
                    Classes
                  </label>
                  <select
                    id="classes"
                    value={symbology.classes}
                    onChange={(e) => update({ classes: Number(e.target.value) })}
                    className={selectClass}
                  >
                    {classOptions.map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
