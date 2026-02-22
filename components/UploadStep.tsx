import React, { useCallback, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  FolderOpen,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react';
import { parseFile, ParsedDataResult } from '../services/fileUtils';
import { GeoJSONData } from '../types';
import { Button } from './Button';

interface UploadStepProps {
  onDataLoaded: (data: GeoJSONData, filename: string) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Staging state
  const [stagedFile, setStagedFile] = useState<{
    filename: string;
    result: ParsedDataResult;
  } | null>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setStagedFile(null);
    try {
      const result = await parseFile(file);
      setStagedFile({
        filename: file.name,
        result: result,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (stagedFile) {
      onDataLoaded(stagedFile.result.data, stagedFile.filename);
    }
  };

  const handleReset = () => {
    setStagedFile(null);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-700 font-['Montserrat'] mb-2">Read Data</h2>
        <p className="text-slate-600">Import your spatial data to begin the investigation.</p>
      </div>

      {/* Supported Formats Section - Only show if no file is staged */}
      {!stagedFile && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">
            Supported Formats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CSV / Excel Card */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0e7490]/10 rounded-lg text-[#0e7490]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800">CSV / Excel</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Spreadsheets must contain columns for latitude (e.g. <code>latitude</code>,{' '}
                <code>lat</code>, <code>y</code>) and longitude (e.g. <code>longitude</code>,{' '}
                <code>lon</code>, <code>x</code>).
              </p>
            </div>

            {/* JSON / GeoJSON Card */}
            <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0e7490]/10 rounded-lg text-[#0e7490]">
                  <FileJson className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800">JSON / GeoJSON</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Supports standard GeoJSON files, or generic JSON arrays containing objects with
                latitude/longitude fields.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Staged File Review Card */}
      {stagedFile ? (
        <div className="bg-white rounded-xl shadow-lg border border-emerald-500/20 overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
          <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-full text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-700 text-lg">File Read Successfully</h3>
                <p className="text-sm text-slate-600">{stagedFile.filename}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {stagedFile.result.data.features.length}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Records Found
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <div
                  className="text-lg font-bold text-slate-700 mb-1 truncate px-2"
                  title={stagedFile.result.detectedLat}
                >
                  {stagedFile.result.detectedLat}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Latitude Column
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <div
                  className="text-lg font-bold text-slate-700 mb-1 truncate px-2"
                  title={stagedFile.result.detectedLon}
                >
                  {stagedFile.result.detectedLon}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Longitude Column
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button variant="secondary" onClick={handleReset}>
                Upload Different File
              </Button>
              <Button
                onClick={handleConfirm}
                className="shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30"
              >
                Configure Map <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative border-3 border-dashed rounded-xl p-12 transition-all duration-300
            flex flex-col items-center justify-center gap-4 bg-white cursor-pointer
            ${isDragging
              ? 'border-emerald-500 bg-emerald-500/5 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-500/5'
            }
          `}
        >
          <div
            className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-emerald-500/20 text-emerald-600' : 'bg-emerald-500/10 text-emerald-600'}`}
          >
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            ) : (
              <FolderOpen className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1 text-center">
            <p className="text-lg font-medium text-slate-700">
              {loading ? 'Processing...' : 'Drag and drop your file here'}
            </p>
            <p className="text-sm text-slate-400">or click to browse</p>
          </div>

          <label className="absolute inset-0 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.json,.geojson"
              onChange={handleFileInput}
              disabled={loading}
            />
          </label>

          {/* Helper Button for visibility */}
          <div className="mt-2 pointer-events-none">
            <Button
              variant="outline"
              className="pointer-events-none opacity-80 !border-emerald-600 !text-emerald-600 hover:bg-emerald-600/5"
            >
              Browse Files
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
