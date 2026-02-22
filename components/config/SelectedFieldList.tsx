import React from 'react';
import { ArrowUp, ArrowDown, X, GripVertical } from 'lucide-react';

interface SelectedFieldListProps {
  selectedFields: string[];
  onRemoveField: (field: string) => void;
  onMoveField: (index: number, direction: 'up' | 'down') => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
}

export const SelectedFieldList: React.FC<SelectedFieldListProps> = ({
  selectedFields,
  onRemoveField,
  onMoveField,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => {
  return (
    <div className="flex flex-col h-[350px] lg:h-full bg-slate-50/30 overflow-hidden">
      <div className="shrink-0 p-3 bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
        <span>Popup Order</span>
        <span className="text-[10px] font-normal normal-case text-slate-400">
          Drag or use arrows
        </span>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-2 custom-scrollbar">
        {selectedFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-4 bg-slate-50">
            <GripVertical className="w-10 h-10 mb-2 opacity-20" />
            <p className="font-medium">No fields selected</p>
            <p className="text-xs opacity-70">Add fields from the left</p>
          </div>
        ) : (
          selectedFields.map((field, index) => (
            <div
              key={field}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnter={(e) => onDragEnter(e, index)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-500/30 transition-all cursor-move hover:shadow-md active:cursor-grabbing"
            >
              <div className="flex flex-col gap-0.5 text-slate-300">
                <button
                  onClick={() => onMoveField(index, 'up')}
                  disabled={index === 0}
                  className="hover:text-emerald-600 disabled:opacity-10 transition-colors p-0.5"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onMoveField(index, 'down')}
                  disabled={index === selectedFields.length - 1}
                  className="hover:text-emerald-600 disabled:opacity-10 transition-colors p-0.5"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1">
                <div className="font-medium text-slate-700 text-sm truncate" title={field}>
                  {field}
                </div>
              </div>

              <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-400 font-mono hidden sm:block">
                #{index + 1}
              </div>

              <button
                onClick={() => onRemoveField(field)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                title="Remove from popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
