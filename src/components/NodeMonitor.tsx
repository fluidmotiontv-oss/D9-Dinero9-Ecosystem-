import React, { useState } from 'react';
import { 
  Activity, 
  Radio, 
  Zap, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Signal, 
  Layers, 
  Sparkles,
  Server,
  ArrowRight
} from 'lucide-react';
import { PeeDubNode, TemporalClock } from '../types';

interface NodeMonitorProps {
  nodes: PeeDubNode[];
  temporalClock: TemporalClock | null;
  onTriggerSyncPulse: () => Promise<void>;
  isPulsing: boolean;
}

export const NodeMonitor: React.FC<NodeMonitorProps> = ({
  nodes,
  temporalClock,
  onTriggerSyncPulse,
  isPulsing,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const averageDrift = nodes.length > 0
    ? +(nodes.reduce((acc, n) => acc + Math.abs(n.temporalDriftMs), 0) / nodes.length).toFixed(3)
    : 0;

  const averageLatency = nodes.length > 0
    ? +(nodes.reduce((acc, n) => acc + n.latencyMs, 0) / nodes.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Pee Dub Corridor Network Stats & Pulse Control */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-100">
                PEE DUB (PW) CORRIDOR NODE SYNCHRONIZATION MONITOR
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-body">
              Continuous 54-minute harmonic consensus across the 140km Wellington - Palmerston North transport & fiber corridor
            </p>
          </div>

          {/* Broadcast Temporal Sync Pulse Button */}
          <button
            onClick={onTriggerSyncPulse}
            disabled={isPulsing}
            className="px-5 py-2.5 rounded-xl clip-octagon bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group"
          >
            <Radio className={`w-4 h-4 ${isPulsing ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
            <span>{isPulsing ? 'Broadcasting Harmonic Pulse...' : 'Broadcast 54m Sync Pulse'}</span>
          </button>
        </div>

        {/* Quick Corridor Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Corridor Length</div>
            <div className="text-lg font-mono-tech font-bold text-slate-100">140 km</div>
            <div className="text-[10px] text-teal-400 font-body">Wellington → Palmy North</div>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Active Nodes</div>
            <div className="text-lg font-mono-tech font-bold text-cyan-300">{nodes.length} Nodes</div>
            <div className="text-[10px] text-slate-400 font-body">100% Corridor Coverage</div>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Corridor Avg Drift</div>
            <div className="text-lg font-mono-tech font-bold text-emerald-400">±{averageDrift} ms</div>
            <div className="text-[10px] text-slate-400 font-body">54-Min Master Delta</div>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Corridor Latency</div>
            <div className="text-lg font-mono-tech font-bold text-teal-300">{averageLatency} ms</div>
            <div className="text-[10px] text-slate-400 font-body">Sub-Harmonic RTT</div>
          </div>
        </div>
      </div>

      {/* Visual Topological Route: Pee Dub Corridor 140km Map */}
      <div className="glass-panel-glow p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h4 className="font-display font-bold text-sm text-slate-100">
              CORRIDOR SPATIAL TOPOLOGY (0km - 140km)
            </h4>
          </div>
          <span className="text-[10px] font-mono-tech text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
            Interactive Node Stations
          </span>
        </div>

        {/* Route Line with Station Nodes */}
        <div className="relative py-8 px-2 overflow-x-auto no-scrollbar">
          {/* Connecting Conduit Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-slate-800 rounded-full">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 opacity-60 animate-pulse" />
          </div>

          <div className="relative flex justify-between items-center min-w-[700px] z-10">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* Km Badge above */}
                  <span className="text-[9px] font-mono-tech text-slate-400 mb-1.5 transition-colors group-hover:text-cyan-300">
                    {node.corridorKm}km
                  </span>

                  {/* Node Hexagon / Octagon Pip */}
                  <div
                    className={`w-9 h-9 clip-octagon p-[1.5px] transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-cyan-400 to-emerald-300 scale-125 shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-700 group-hover:bg-cyan-500/60'
                    }`}
                  >
                    <div
                      className={`w-full h-full clip-octagon flex items-center justify-center text-xs font-mono-tech font-bold ${
                        isSelected
                          ? 'bg-slate-950 text-cyan-300'
                          : 'bg-slate-900 text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {node.id.split('-')[1]}
                    </div>
                  </div>

                  {/* Name below */}
                  <span
                    className={`text-[10px] font-body text-center mt-2 max-w-[80px] leading-tight line-clamp-2 ${
                      isSelected ? 'text-cyan-300 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {node.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Summary Box */}
        {selectedNode && (
          <div className="mt-4 p-4 bg-slate-950/70 rounded-xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 clip-octagon bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-slate-100">
                    {selectedNode.name}
                  </span>
                  <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {selectedNode.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-body flex items-center gap-1.5">
                  <span>{selectedNode.location}</span>
                  <span>•</span>
                  <span className="text-teal-400 font-mono-tech">{selectedNode.role}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono-tech">
              <div>
                <span className="text-slate-500 block text-[9px]">TEMPORAL DRIFT</span>
                <span className={`font-bold ${Math.abs(selectedNode.temporalDriftMs) < 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedNode.temporalDriftMs > 0 ? `+${selectedNode.temporalDriftMs}` : selectedNode.temporalDriftMs} ms
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">BLOCK HEIGHT</span>
                <span className="text-slate-200 font-bold">{selectedNode.blockHeight.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">HARMONIC WT</span>
                <span className="text-cyan-300 font-bold">{selectedNode.harmonicWeight}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Node Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isDriftOptimal = Math.abs(node.temporalDriftMs) < 0.5;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-slate-900/80 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono-tech font-bold text-xs text-slate-200">
                    {node.id}
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {node.corridorKm} km
                </span>
              </div>

              <h5 className="font-display font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {node.name}
              </h5>
              <p className="text-xs text-slate-400 font-body mb-3">
                {node.location}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono-tech">
                <div>
                  <span className="text-slate-500 block">DRIFT</span>
                  <span className={`font-bold ${isDriftOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {node.temporalDriftMs > 0 ? `+${node.temporalDriftMs}` : node.temporalDriftMs} ms
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">LATENCY</span>
                  <span className="text-slate-300 font-semibold">{node.latencyMs} ms</span>
                </div>

                <div>
                  <span className="text-slate-500 block">PEERS</span>
                  <span className="text-teal-400 font-semibold">{node.peersConnected}</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-3 flex items-center justify-between text-[9px] font-mono-tech text-slate-500">
                <span className="uppercase text-cyan-400 font-medium">{node.role}</span>
                <span>54m Sync Active</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
