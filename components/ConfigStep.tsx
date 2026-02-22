import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import { GeneralSettings } from './config/GeneralSettings';
import { AvailableFieldList } from './config/AvailableFieldList';
import { SelectedFieldList } from './config/SelectedFieldList';

interface ConfigStepProps {
  filename: string;
  availableFields: string[];
  initialTitle: string;
  initialSelectedFields: string[];
  initialColorField?: string | null;
  initialPalette?: string;
  onBack: () => void;
  onComplete: (
    title: string,
    selectedFields: string[],
    colorField: string | null,
    palette: string
  ) => void;
}

export const ConfigStep: React.FC<ConfigStepProps> = ({
  filename,
  availableFields,
  initialTitle,
  initialSelectedFields,
  initialColorField,
  initialPalette,
  onBack,
  onComplete,
}) => {
  const [title, setTitle] = useState(initialTitle || `Map of ${filename}`);
  // State for ordered selected fields. Use prop if available (returning from Map), else default to first 5.
  const [selectedFields, setSelectedFields] = useState<string[]>(
    initialSelectedFields.length > 0 ? initialSelectedFields : availableFields.slice(0, 5)
  );
  // State for symbol color category
  const [colorField, setColorField] = useState<string>(initialColorField || '');
  const [palette, setPalette] = useState<string>(initialPalette || 'VIBRANT');

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleAddField = (field: string) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleRemoveField = (field: string) => {
    setSelectedFields(selectedFields.filter((f) => f !== field));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...selectedFields];
    if (direction === 'up' && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    }
    setSelectedFields(newFields);
  };

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    // Set explicit data transfer for broader compatibility
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current === dragOverItem.current
    ) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const _selectedFields = [...selectedFields];
    const draggedItemContent = _selectedFields[dragItem.current];

    // Remove the item from the source
    _selectedFields.splice(dragItem.current, 1);

    // Insert at new position
    _selectedFields.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setSelectedFields(_selectedFields);
  };

  const handleNext = () => {
    if (!title.trim()) {
      alert('Please enter a map title');
      return;
    }
    onComplete(title, selectedFields, colorField || null, palette);
  };

  // Fields that are not yet selected
  const unselectedFields = availableFields.filter((f) => !selectedFields.includes(f));

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pb-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors group"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-emerald-700" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-emerald-700 font-['Montserrat']">Configure Map</h2>
          <p className="text-slate-500 text-sm">Customize visualization and popup content</p>
        </div>
      </div>

      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 delay-100">
        {/* Top Section: General Settings */}
        <GeneralSettings
          title={title}
          setTitle={setTitle}
          colorField={colorField}
          setColorField={setColorField}
          palette={palette}
          setPalette={setPalette}
          availableFields={availableFields}
        />

        {/* Unified Popup Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-emerald-500/20">
          <div className="shrink-0 p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <List className="w-4 h-4 text-emerald-600" />
                Popup Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select fields to display in the map popup.
              </p>
            </div>
            <div className="text-xs font-medium px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">
              {selectedFields.length} fields selected
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Available Fields (Left) */}
            <AvailableFieldList unselectedFields={unselectedFields} onAddField={handleAddField} />

            {/* Selected Fields (Right) */}
            <SelectedFieldList
              selectedFields={selectedFields}
              onRemoveField={handleRemoveField}
              onMoveField={moveField}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-2 pb-6">
          <Button
            onClick={handleNext}
            className="w-full md:w-auto px-8 py-3 text-lg shadow-xl shadow-emerald-600/10 hover:shadow-2xl hover:shadow-emerald-600/20 border-0"
          >
            Generate Map <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
