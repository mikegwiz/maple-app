import React, { Suspense, lazy, useState } from 'react';

import { ConfigStep } from './components/ConfigStep';
import { HomeStep } from './components/HomeStep';
import { UploadStep } from './components/UploadStep';
import logo from './Maple_Leaf_Green_PNG_Clip_Art_Image.png';
import { AppState, AppStep, GeoJSONData } from './types';

// Leaflet and MapLibre are only needed on the map step, so load them on demand
const MapStep = lazy(() =>
  import('./components/MapStep').then((m) => ({ default: m.MapStep }))
);

// Nav used for all steps besides Home and Map
const InternalNav: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <button type="button" className="flex items-center gap-2" onClick={onHome}>
          <img src={logo} alt="MAPLE Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
          <span className="font-bold text-xl tracking-tight text-slate-900">MAPLE</span>
        </button>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: AppStep.HOME,
    data: null,
    availableFields: [],
    selectedFields: [],
    mapTitle: '',
    colorField: null,
    colorPalette: 'VIBRANT',
  });

  const handleStart = () => setState((s) => ({ ...s, step: AppStep.UPLOAD }));

  const handleDataLoaded = (data: GeoJSONData, filename: string) => {
    const fields = new Set<string>();
    data.features.slice(0, 10).forEach((f) => {
      Object.keys(f.properties || {}).forEach((k) => fields.add(k));
    });

    const sortedFields = Array.from(fields).sort();

    setState((prev) => ({
      ...prev,
      step: AppStep.CONFIG,
      data,
      availableFields: sortedFields,
      selectedFields: sortedFields.slice(0, 5),
      mapTitle: filename.split('.')[0] || 'My Map',
      colorField: null,
      colorPalette: 'VIBRANT',
    }));
  };

  const handleConfigComplete = (
    title: string,
    selectedFields: string[],
    colorField: string | null,
    palette: string
  ) => {
    setState((prev) => ({
      ...prev,
      step: AppStep.MAP,
      mapTitle: title,
      selectedFields,
      colorField,
      colorPalette: palette,
    }));
  };

  const handleBack = () => {
    setState((prev) => {
      if (prev.step === AppStep.MAP) return { ...prev, step: AppStep.CONFIG };
      if (prev.step === AppStep.CONFIG) return { ...prev, step: AppStep.UPLOAD, data: null };
      if (prev.step === AppStep.UPLOAD) return { ...prev, step: AppStep.HOME };
      return prev;
    });
  };

  const goHome = () => setState((s) => ({ ...s, step: AppStep.HOME }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      {state.step !== AppStep.MAP && state.step !== AppStep.HOME && <InternalNav onHome={goHome} />}

      {state.step === AppStep.HOME ? (
        <HomeStep onStart={handleStart} />
      ) : (
        <main
          className={
            state.step !== AppStep.MAP
              ? 'px-6 md:px-12 max-w-7xl mx-auto flex-1 w-full flex flex-col pt-24'
              : 'h-screen w-full'
          }
        >
          {state.step === AppStep.UPLOAD && (
            <div className="flex-1 flex flex-col justify-center">
              <UploadStep onDataLoaded={handleDataLoaded} />
              <div className="mt-8 text-center">
                <button
                  onClick={handleBack}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  &larr; Back to Home
                </button>
              </div>
            </div>
          )}

          {state.step === AppStep.CONFIG && (
            <ConfigStep
              availableFields={state.availableFields}
              initialTitle={state.mapTitle}
              initialSelectedFields={state.selectedFields}
              initialColorField={state.colorField}
              initialPalette={state.colorPalette}
              onBack={handleBack}
              onComplete={handleConfigComplete}
            />
          )}

          {state.step === AppStep.MAP && state.data && (
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center text-slate-400">
                  Loading map…
                </div>
              }
            >
              <MapStep
                data={state.data}
                title={state.mapTitle}
                selectedFields={state.selectedFields}
                colorField={state.colorField}
                colorPalette={state.colorPalette}
                onBack={handleBack}
              />
            </Suspense>
          )}
        </main>
      )}

      {state.step !== AppStep.MAP && (
        <footer className={
          state.step === AppStep.HOME
            ? "bg-slate-50 py-12 border-t border-slate-200 text-slate-600"
            : "bg-slate-50 py-12 border-t border-slate-200 text-slate-600 mt-auto"
        }>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Brand */}
              <div className="flex items-center gap-2">
                <img src={logo} alt="MAPLE Logo" className="w-7 h-7 object-contain drop-shadow-sm" />
                <span className="font-bold text-lg text-slate-800">MAPLE</span>
              </div>

              {/* Copyright & Tagline */}
              <div className="text-center md:text-left text-sm">
                <p>Mapping Application for Private Local Exploration.</p>
                <p className="mt-1 text-slate-400">Designed by Michael Giangrande.</p>
              </div>

              {/* Socials */}
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 mt-6 md:mt-0">
                <a href="https://www.linkedin.com/in/mg-gis/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors text-2xl" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="https://x.com/mikeGeoWiz" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors text-2xl" aria-label="X">
                  <i className="fa-brands fa-square-x-twitter"></i>
                </a>
                <a href="https://medium.com/@giangrande_m" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors text-2xl" aria-label="Medium">
                  <i className="fa-brands fa-medium"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
