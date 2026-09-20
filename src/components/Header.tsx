import React from 'react';
import { Activity, Clock, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import { TemporalClock } from '../types';

interface HeaderProps {
  temporalClock: TemporalClock | null;
  activeTab: 'all' | 'supply' | 'nodes' | 'bridge';
  setActiveTab: (tab: 'all' | 'supply' | 'nodes' | 'bridge') => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  temporalClock,
  activeTab,
  setActiveTab,
  onRefreshAll,
  isRefreshing,
}) => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding with Octagonal Motif */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('all')}>
              {/* Octagonal outer glow */}
              <div className="w-12 h-12 clip-octagon bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full clip-octagon bg-slate-950 flex items-center justify-center">
                  <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300 text-xl tracking-wider">
                    D9
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-slate-100 uppercase">
                  Deniro 9 <span className="text-cyan-400">Ecosystem</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-tech tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 clip-octagon">
                  v2.9.4 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body flex items-center gap-2">
                <span>NZ Per-Capita 5.3B Cap</span>
                <span className="text-slate-600">•</span>
                <span className="text-teal-400 font-medium">Pee Dub Corridor</span>
                <span className="text-slate-600">•</span>
                <span>Fluid Motion TV Architecture</span>
              </p>
            </div>
          </div>

          {/* Temporal 54-Min Clock Pill (Dragon 9 Framework) */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 border border-cyan-500/25 px-4 py-2 clip-octagon-lg shadow-inner shadow-cyan-950/40">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '54s' }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono-tech uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Dragon 9 Temporal Clock (54m/hr)
                </span>
                <div className="text-sm font-mono-tech font-bold text-slate-100">
                  {temporalClock ? (
                    <>
                      {pad(temporalClock.d9Hour)}:{pad(temporalClock.d9Minute)}:{pad(temporalClock.d9Second)}
                      <span className="text-slate-500 text-xs ml-1">
                        (Octave {temporalClock.currentOctave}/9)
                      </span>
                    </>
                  ) : (
                    'SYNCHRONIZING...'
                  )}
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="text-right">
              <div className="text-[10px] font-mono-tech text-slate-400">EPOCH RESONANCE</div>
              <div className="text-xs font-mono-tech text-emerald-400 font-semibold">
                {temporalClock ? `${(temporalClock.temporalResonance * 100).toFixed(1)}% (9 Hz)` : '9.0 Hz'}
              </div>
            </div>
          </div>

          {/* Action & Refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer group"
              title="Refresh simulated state from backend"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2.5 overflow-x-auto no-scrollbar text-xs sm:text-sm font-display border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unified Command</span>
          </button>

          <button
            onClick={() => setActiveTab('supply')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supply'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Per-Capita Supply (5.3B NZ Cap)</span>
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nodes'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2. Pee Dub Node Sync (54m Hour)</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bridge'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. Cross-Chain HTLC Bridge</span>
          </button>
        </div>
      </div>
    </header>
  );
};
