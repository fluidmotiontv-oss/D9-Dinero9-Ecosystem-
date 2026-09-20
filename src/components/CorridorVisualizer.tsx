import React from 'react';
import { Radio, Waves, Shield, Compass, Sparkles } from 'lucide-react';
import { PeeDubNode } from '../types';

interface CorridorVisualizerProps {
  nodes: PeeDubNode[];
  isPulsing: boolean;
}

export const CorridorVisualizer: React.FC<CorridorVisualizerProps> = ({ nodes, isPulsing }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/25 relative overflow-hidden">
      {/* Visual background atmospheric elements */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-24 bg-gradient-to-t from-emerald-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h4 className="font-display font-bold text-sm sm:text-base text-slate-100">
              PEE DUB CORRIDOR FLUID WAVE TELEMETRY
            </h4>
          </div>
          <p className="text-xs text-slate-400 font-body">
            Active acoustic & fiber harmonic transmission spanning Wellington, Kapiti Coast, Horowhenua, and Palmerston North
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300">Carrier Wave: 9.0 Hz Sub-Harmonic</span>
        </div>
      </div>

      {/* Corridor Visual Canvas (SVG / CSS Animation) */}
      <div className="relative w-full h-44 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 overflow-hidden flex flex-col justify-between">
        
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ambient Animated Sine Wave representing the 54m Hour Harmonic */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 opacity-40 pointer-events-none flex items-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M0,50 Q125,10 250,50 T500,50 T750,50 T1000,50"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              className={isPulsing ? 'animate-pulse text-cyan-300' : ''}
            />
            <path
              d="M0,50 Q125,90 250,50 T500,50 T750,50 T1000,50"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              className="opacity-70"
            />
          </svg>
        </div>

        {/* Top telemetry status */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold">PW-SOUTH (0 KM)</span>
            <span>Wellington Harbor Genesis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Palmerston North Inland Nexus</span>
            <span className="text-emerald-400 font-bold">PW-NORTH (140 KM)</span>
          </div>
        </div>

        {/* Node Points along the Wave Line */}
        <div className="relative z-10 flex items-center justify-between w-full px-2">
          {nodes.map((node, index) => {
            const isSouthCitadel = index === 0;
            const isNorthNexus = index === nodes.length - 1;

            return (
              <div key={node.id} className="flex flex-col items-center group cursor-pointer">
                <div
                  className={`w-4 h-4 clip-octagon transition-all duration-300 flex items-center justify-center ${
                    isPulsing
                      ? 'bg-cyan-300 scale-125 shadow-lg shadow-cyan-400/80 animate-ping'
                      : isSouthCitadel || isNorthNexus
                      ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 ring-2 ring-cyan-500/40'
                      : 'bg-slate-700 group-hover:bg-cyan-400'
                  }`}
                >
                  <div className="w-2 h-2 clip-octagon bg-slate-950" />
                </div>
                <span className="text-[9px] font-mono-tech text-slate-400 mt-2 group-hover:text-cyan-300">
                  {node.id.split('-')[1]}
                </span>
                <span className="text-[8px] font-mono-tech text-slate-500">
                  {node.corridorKm}km
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Legend */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-tech text-slate-500 pt-2 border-t border-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Consensus Backbone</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>54m Temporal Synced</span>
            </span>
          </div>
          <span className="text-cyan-400/80">
            {isPulsing ? 'TRANSMITTING COHERENT WAVE PULSE...' : 'CORRIDOR STABLE (COHERENCE 99.8%)'}
          </span>
        </div>

      </div>
    </div>
  );
};
