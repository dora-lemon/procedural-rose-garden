import React, { useState, useCallback } from 'react';
import { Experience } from './components/Experience';
import { LeafConfig } from './types';

// Simple SVG Icons
const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

const IconInfo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

export default function App() {
  const [seed, setSeed] = useState(Date.now());
  const [petalCount, setPetalCount] = useState(10);
  const [stemLength, setStemLength] = useState(2.5);
  const [leafSize, setLeafSize] = useState(1.8);
  const [leafScaleNearFlower, setLeafScaleNearFlower] = useState(0.3);
  const [leafAngleMin, setLeafAngleMin] = useState(8);
  const [leafAngleMax, setLeafAngleMax] = useState(40);
  const [branchAngleMin, setBranchAngleMin] = useState(30);
  const [branchAngleMax, setBranchAngleMax] = useState(60);
  const [curvature, setCurvature] = useState(0.5);  // Branch curvature
  const [petalGradientStart, setPetalGradientStart] = useState('#ff69b4');  // Hot pink
  const [petalGradientEnd, setPetalGradientEnd] = useState('#ffffff');      // White
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [selectedLeafId, setSelectedLeafId] = useState<string | undefined>(undefined);
  const [leafConfigs, setLeafConfigs] = useState<Record<string, LeafConfig>>({});

  const handleRegenerate = useCallback(() => {
    setSeed(Date.now());
    // Clear leaf selection when regenerating
    setSelectedLeafId(undefined);
    setLeafConfigs({});
  }, []);

  const handleLeafClick = useCallback((leafId: string) => {
    // Toggle selection: if clicking the same leaf, deselect it
    if (selectedLeafId === leafId) {
      setSelectedLeafId(undefined);
    } else {
      setSelectedLeafId(leafId);
      // Initialize leaf config if not exists
      if (!leafConfigs[leafId]) {
        setLeafConfigs(prev => ({
          ...prev,
          [leafId]: {
            id: leafId,
            branchIndex: 0,
            leafIndex: 0,
            size: 1.0,
            angle: 30,
            color: '#2d5a27'
          }
        }));
      }
    }
  }, [selectedLeafId, leafConfigs]);

  const handleLeafParamChange = useCallback((leafId: string, param: keyof LeafConfig, value: any) => {
    setLeafConfigs(prev => ({
      ...prev,
      [leafId]: {
        ...prev[leafId],
        [param]: value
      }
    }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#87CEEB] text-slate-800 font-sans overflow-hidden">
      
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <Experience
            seed={seed}
            petalCount={petalCount}
            stemLength={stemLength}
            leafSize={leafSize}
            leafScaleNearFlower={leafScaleNearFlower}
            leafAngleMin={leafAngleMin}
            leafAngleMax={leafAngleMax}
            branchAngleMin={branchAngleMin}
            branchAngleMax={branchAngleMax}
            curvature={curvature}
            petalGradientStart={petalGradientStart}
            petalGradientEnd={petalGradientEnd}
            selectedLeafId={selectedLeafId}
            onLeafClick={handleLeafClick}
            leafConfigs={leafConfigs}
        />
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto">
            <h1 className="text-3xl font-bold tracking-widest text-slate-900 drop-shadow-sm" style={{ fontFamily: 'Times New Roman, serif' }}>
                DIGITAL FLORA
            </h1>
            <p className="text-xs text-slate-700 mt-1 tracking-widest uppercase font-semibold">Botanical Simulation</p>
        </div>

        <div className="flex gap-2 pointer-events-auto">
             <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`bg-white/40 hover:bg-white/60 backdrop-blur-md p-2 rounded-full transition-all ${showSettings ? 'text-emerald-800' : 'text-slate-700'} hover:text-emerald-900 shadow-sm`}
            >
                <IconSettings />
            </button>
            <button 
                onClick={() => setShowInfo(!showInfo)}
                className={`bg-white/40 hover:bg-white/60 backdrop-blur-md p-2 rounded-full transition-all ${showInfo ? 'text-emerald-800' : 'text-slate-700'} hover:text-emerald-900 shadow-sm`}
            >
                <IconInfo />
            </button>
        </div>
      </div>

      {/* Settings Panel */}
       {showSettings && (
        <div className="absolute top-24 right-6 w-64 p-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl z-10 transition-all duration-500 animate-in slide-in-from-right-10 pointer-events-auto shadow-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-slate-800 font-serif text-lg mb-4 italic border-b border-slate-300/50 pb-2">Configuration</h3>
            
            <div className="space-y-4">
                {/* Petal Count */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Petal Count</span>
                        <span className="text-emerald-700 font-mono">{petalCount}</span>
                    </label>
                    <input 
                        type="range" 
                        min="5" 
                        max="100" 
                        value={petalCount} 
                        onChange={(e) => setPetalCount(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>
                
                {/* Stem Length */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Stem Length</span>
                        <span className="text-emerald-700 font-mono">{stemLength}</span>
                    </label>
                    <input 
                        type="range" 
                        min="2" 
                        max="8" 
                        step="0.5"
                        value={stemLength} 
                        onChange={(e) => setStemLength(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Leaf Size */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Leaf Size</span>
                        <span className="text-emerald-700 font-mono">{leafSize.toFixed(1)}</span>
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={leafSize}
                        onChange={(e) => setLeafSize(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Leaf Scale Near Flower */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Leaf Scale (Near Flower)</span>
                        <span className="text-emerald-700 font-mono">{leafScaleNearFlower.toFixed(2)}</span>
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={leafScaleNearFlower}
                        onChange={(e) => setLeafScaleNearFlower(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                <div className="h-px bg-slate-300/50 my-2"></div>

                {/* Petal Gradient Colors */}
                <div className="space-y-2">
                    <label className="text-xs text-slate-600 uppercase tracking-widest font-bold">
                        Petal Gradient Colors
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={petalGradientStart}
                            onChange={(e) => setPetalGradientStart(e.target.value)}
                            className="w-12 h-8 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs text-slate-500">Base</span>
                        <input
                            type="color"
                            value={petalGradientEnd}
                            onChange={(e) => setPetalGradientEnd(e.target.value)}
                            className="w-12 h-8 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs text-slate-500">Tip</span>
                    </div>
                </div>

                <div className="h-px bg-slate-300/50 my-2"></div>

                {/* Leaf Angle Min */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Min Leaf Angle</span>
                        <span className="text-emerald-700 font-mono">{leafAngleMin}°</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="90" 
                        value={leafAngleMin} 
                        onChange={(e) => setLeafAngleMin(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Leaf Angle Max */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Max Leaf Angle</span>
                        <span className="text-emerald-700 font-mono">{leafAngleMax}°</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="120" 
                        value={leafAngleMax} 
                        onChange={(e) => setLeafAngleMax(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                 <div className="h-px bg-slate-300/50 my-2"></div>

                 {/* Branch Angle Min */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Min Branch Angle</span>
                        <span className="text-emerald-700 font-mono">{branchAngleMin}°</span>
                    </label>
                    <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={branchAngleMin} 
                        onChange={(e) => setBranchAngleMin(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Branch Angle Max */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Max Branch Angle</span>
                        <span className="text-emerald-700 font-mono">{branchAngleMax}°</span>
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="120"
                        value={branchAngleMax}
                        onChange={(e) => setBranchAngleMax(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                <div className="h-px bg-slate-300/50 my-2"></div>

                {/* Branch Curvature */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Branch Curvature</span>
                        <span className="text-emerald-700 font-mono">{curvature.toFixed(2)}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={curvature}
                        onChange={(e) => setCurvature(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>
            </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-auto flex flex-col items-center gap-4">
        <button
          onClick={handleRegenerate}
          className="group relative flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/30"
        >
           <span className="group-hover:rotate-180 transition-transform duration-700">
             <IconRefresh />
           </span>
           <span className="text-sm font-bold tracking-wider uppercase">Regenerate</span>
        </button>
      </div>

      {/* Information Panel */}
      {showInfo && (
        <div className="absolute top-24 right-6 w-64 p-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl z-10 transition-all duration-500 animate-in slide-in-from-right-10 pointer-events-auto mt-[160px] shadow-lg">
            <h3 className="text-slate-800 font-serif text-lg mb-2 italic">Simulation Details</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                This simulation uses procedural generation to create a unique flower structure rendered in a flat, illustrative style.
            </p>
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 border-b border-slate-300/50 pb-1">
                    <span>Algorithm</span>
                    <span className="text-emerald-700 font-medium">Fibonacci Spiral</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 border-b border-slate-300/50 pb-1">
                    <span>Rendering</span>
                    <span className="text-emerald-700 font-medium">Flat Shading</span>
                </div>
            </div>
        </div>
      )}

      {/* Leaf Editor Panel */}
      {selectedLeafId && leafConfigs[selectedLeafId] && (
        <div className="absolute top-24 left-6 w-72 p-6 bg-amber-50/80 backdrop-blur-xl border border-amber-200/60 rounded-2xl z-10 transition-all duration-500 animate-in slide-in-from-left-10 pointer-events-auto shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-800 font-serif text-lg italic">Leaf Editor</h3>
                <button
                    onClick={() => setSelectedLeafId(undefined)}
                    className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>
            <p className="text-xs text-slate-600 mb-4">
                Editing: <span className="font-mono text-emerald-700">{selectedLeafId}</span>
            </p>

            <div className="space-y-4">
                {/* Leaf Size */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Size</span>
                        <span className="text-amber-700 font-mono">{leafConfigs[selectedLeafId]?.size.toFixed(2)}x</span>
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={leafConfigs[selectedLeafId]?.size || 1.0}
                        onChange={(e) => handleLeafParamChange(selectedLeafId, 'size', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Leaf Angle */}
                <div className="space-y-2">
                    <label className="flex justify-between text-xs text-slate-600 uppercase tracking-widest font-bold">
                        <span>Angle</span>
                        <span className="text-amber-700 font-mono">{leafConfigs[selectedLeafId]?.angle.toFixed(0)}°</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="120"
                        value={leafConfigs[selectedLeafId]?.angle || 30}
                        onChange={(e) => handleLeafParamChange(selectedLeafId, 'angle', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Leaf Color */}
                <div className="space-y-2">
                    <label className="text-xs text-slate-600 uppercase tracking-widest font-bold">
                        Color
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={leafConfigs[selectedLeafId]?.color || '#2d5a27'}
                            onChange={(e) => handleLeafParamChange(selectedLeafId, 'color', e.target.value)}
                            className="w-12 h-8 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs text-slate-500 font-mono">{leafConfigs[selectedLeafId]?.color || '#2d5a27'}</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}