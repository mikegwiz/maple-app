import React from 'react';
import { Settings, Palette } from 'lucide-react';
import { COLOR_PALETTES } from '../../constants';

interface GeneralSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  colorField: string;
  setColorField: (field: string) => void;
  palette: string;
  setPalette: (palette: string) => void;
  availableFields: string[];
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  title,
  setTitle,
  colorField,
  setColorField,
  palette,
  setPalette,
  availableFields,
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
          <label className="block text-sm font-bold text-slate-700 mb-2">Map Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. Facilities Locations 2024"
          />
          <p className="mt-2 text-xs text-slate-400">Displayed at the top of the map.</p>
        </div>

        {/* Coloring */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              Color Features By
            </label>
            <select
              value={colorField}
              onChange={(e) => setColorField(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white cursor-pointer"
            >
              <option value="">None (Single Color)</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {colorField && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                Palette Scheme
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white cursor-pointer"
                >
                  {Object.keys(COLOR_PALETTES).map((key) => (
                    <option key={key} value={key}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <div className="flex-1 flex gap-0.5 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  {COLOR_PALETTES[palette].map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
