import React from 'react';
import { Plus } from 'lucide-react';

interface AvailableFieldListProps {
  unselectedFields: string[];
  onAddField: (field: string) => void;
}

export const AvailableFieldList: React.FC<AvailableFieldListProps> = ({
  unselectedFields,
  onAddField,
}) => {
  return (
    <div className="flex flex-col h-[350px] lg:h-full bg-white overflow-hidden">
      <div className="shrink-0 p-3 bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Available Variables
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1 custom-scrollbar">
        {unselectedFields.length === 0 ? (
          <p className="text-center text-slate-300 py-10 text-sm italic">All variables selected</p>
        ) : (
          unselectedFields.map((field) => (
            <div
              key={field}
              className="group flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all"
            >
              <span className="text-sm text-slate-600 truncate max-w-[280px]" title={field}>
                {field}
              </span>
              <button
                onClick={() => onAddField(field)}
                className="p-1 text-emerald-600 bg-emerald-600/5 hover:bg-emerald-600 hover:text-white rounded transition-all opacity-60 group-hover:opacity-100"
                title="Add to popup"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
