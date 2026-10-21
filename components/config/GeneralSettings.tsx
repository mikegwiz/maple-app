import { Settings } from 'lucide-react';
import React from 'react';

import { SymbologySettings } from './SymbologySettings';
import { NumericStats, Symbology } from '../../types';


interface GeneralSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  symbology: Symbology;
  onSymbologyChange: (symbology: Symbology) => void;
  availableFields: string[];
  numericStats: Record<string, NumericStats>;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  title,
  setTitle,
  symbology,
  onSymbologyChange,
  availableFields,
  numericStats,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-emerald-500/20">
      <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
        <Settings className="w-4 h-4 text-emerald-600" />
        General Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Map Title */}
        <div>
          <label htmlFor="map-title" className="block text-sm font-bold text-slate-700 mb-2">
            Map Title
          </label>
          <input
            id="map-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. Facilities Locations 2024"
          />
          <p className="mt-2 text-xs text-slate-400">Displayed at the top of the map.</p>
        </div>

        <SymbologySettings
          symbology={symbology}
          onChange={onSymbologyChange}
          availableFields={availableFields}
          numericStats={numericStats}
        />
      </div>
    </div>
  );
};
