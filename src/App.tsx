import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TemporalClockCard } from './components/TemporalClockCard';
import { SupplyDashboard } from './components/SupplyDashboard';
import { NodeMonitor } from './components/NodeMonitor';
import { BridgeGateway } from './components/BridgeGateway';
import { CorridorVisualizer } from './components/CorridorVisualizer';
import { 
  SupplyState, 
  TemporalClock, 
  PeeDubNode, 
  HTLCSwap, 
  VolatilityEngine, 
  SovereignGuardian 
} from './types';
import { ShieldCheck, Activity, Zap, Layers, Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'supply' | 'nodes' | 'bridge'>('all');
  const [temporalClock, setTemporalClock] = useState<TemporalClock | null>(null);
  const [supply, setSupply] = useState<SupplyState | null>(null);
  const [nodes, setNodes] = useState<PeeDubNode[]>([]);
  const [swaps, setSwaps] = useState<HTLCSwap[]>([]);
  const [volatility, setVolatility] = useState<VolatilityEngine | null>(null);
  const [guardians, setGuardians] = useState<SovereignGuardian[]>([]);
  
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isUpdatingSupply, setIsUpdatingSupply] = useState<boolean>(false);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [isExecutingSwap, setIsExecutingSwap] = useState<boolean>(false);

  // Fetch all simulation state from Node/Express API
  const fetchAllData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [statusRes, supplyRes, nodesRes, bridgeRes, clockRes] = await Promise.all([
        fetch('/api/status').then((r) => r.json()).catch(() => null),
        fetch('/api/supply-cap').then((r) => r.json()).catch(() => null),
        fetch('/api/nodes').then((r) => r.json()).catch(() => null),
        fetch('/api/bridge/state').then((r) => r.json()).catch(() => null),
        fetch('/api/temporal-clock').then((r) => r.json()).catch(() => null),
      ]);

      if (clockRes) setTemporalClock(clockRes);
      if (supplyRes) setSupply(supplyRes);
      if (nodesRes?.nodes) setNodes(nodesRes.nodes);
      if (bridgeRes) {
        if (bridgeRes.recentSwaps) setSwaps(bridgeRes.recentSwaps);
        if (bridgeRes.volatilityDampener) setVolatility(bridgeRes.volatilityDampener);
        if (bridgeRes.guardians) setGuardians(bridgeRes.guardians);
      }
    } catch (err) {
      console.error('Error hydrating Deniro 9 simulator state:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Poll temporal clock and node metrics every 1.5 seconds for live 54m experience
  useEffect(() => {
    fetchAllData();

    const interval = setInterval(async () => {
      try {
        const [clockRes, nodesRes, bridgeRes] = await Promise.all([
          fetch('/api/temporal-clock').then((r) => r.json()).catch(() => null),
          fetch('/api/nodes').then((r) => r.json()).catch(() => null),
          fetch('/api/bridge/state').then((r) => r.json()).catch(() => null),
        ]);

        if (clockRes) setTemporalClock(clockRes);
        if (nodesRes?.nodes) setNodes(nodesRes.nodes);
        if (bridgeRes?.volatilityDampener) setVolatility(bridgeRes.volatilityDampener);
      } catch (e) {
        // silent fail on poll
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Handle population recalibration in per-capita dashboard
  const handleAdjustPopulation = async (newPop: number) => {
    try {
      setIsUpdatingSupply(true);
      const res = await fetch('/api/supply-cap/adjust-population', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPopulation: newPop }),
      });
      const data = await res.json();
      if (data.supplyState) {
        // Refresh supply
        const refreshedSupply = await fetch('/api/supply-cap').then((r) => r.json());
        setSupply(refreshedSupply);
      }
    } catch (err) {
      console.error('Error adjusting population:', err);
    } finally {
      setIsUpdatingSupply(false);
    }
  };

  // Handle triggering corridor 54m sync pulse
  const handleTriggerSyncPulse = async () => {
    try {
      setIsPulsing(true);
      const res = await fetch('/api/nodes/sync-pulse', { method: 'POST' });
      const data = await res.json();
      if (data.nodes) {
        setNodes(data.nodes);
      }
    } catch (err) {
      console.error('Error broadcasting sync pulse:', err);
    } finally {
      setTimeout(() => setIsPulsing(false), 2000);
    }
  };

  // Handle executing simulated HTLC atomic swap
  const handleExecuteSwap = async (amountD9: number, targetAsset: string, recipientAddress: string) => {
    try {
      setIsExecutingSwap(true);
      const res = await fetch('/api/bridge/execute-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountD9, targetAsset, recipientAddress }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh bridge and supply states
        const [bridgeRes, supplyRes] = await Promise.all([
          fetch('/api/bridge/state').then((r) => r.json()),
          fetch('/api/supply-cap').then((r) => r.json()),
        ]);
        if (bridgeRes?.recentSwaps) setSwaps(bridgeRes.recentSwaps);
        if (supplyRes) setSupply(supplyRes);
      }
    } catch (err) {
      console.error('Error executing simulated swap:', err);
    } finally {
      setIsExecutingSwap(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header */}
      <Header
        temporalClock={temporalClock}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshAll={fetchAllData}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Temporal Clock Visualizer: Highlighted on all screens */}
        <TemporalClockCard clock={temporalClock} />

        {/* Tab View Routing */}
        {activeTab === 'all' && (
          <div className="space-y-10">
            
            {/* Section 1: Per-Capita Supply Dashboard */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 clip-octagon bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                    01
                  </div>
                  <h2 className="font-display font-black text-lg tracking-wider text-slate-100 uppercase">
                    Per-Capita Supply Architecture (5.3B Ceiling)
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('supply')}
                  className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Full View →
                </button>
              </div>
              <SupplyDashboard
                supply={supply}
                onAdjustPopulation={handleAdjustPopulation}
                isUpdating={isUpdatingSupply}
              />
            </section>

            {/* Section 2: Pee Dub Node Sync & Corridor Visualizer */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 clip-octagon bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold">
                    02
                  </div>
                  <h2 className="font-display font-black text-lg tracking-wider text-slate-100 uppercase">
                    Pee Dub Corridor Node Synchronization (54m Hour)
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('nodes')}
                  className="text-xs font-mono-tech text-teal-400 hover:text-teal-300 cursor-pointer"
                >
                  Full View →
                </button>
              </div>
              <CorridorVisualizer nodes={nodes} isPulsing={isPulsing} />
              <NodeMonitor
                nodes={nodes}
                temporalClock={temporalClock}
                onTriggerSyncPulse={handleTriggerSyncPulse}
                isPulsing={isPulsing}
              />
            </section>

            {/* Section 3: Cross-Chain Bridge Gateway */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 clip-octagon bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                    03
                  </div>
                  <h2 className="font-display font-black text-lg tracking-wider text-slate-100 uppercase">
                    Cross-Chain Liquidity Bridge & Volatility Dampener
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('bridge')}
                  className="text-xs font-mono-tech text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Full View →
                </button>
              </div>
              <BridgeGateway
                volatility={volatility}
                guardians={guardians}
                swaps={swaps}
                onExecuteSwap={handleExecuteSwap}
                isExecuting={isExecutingSwap}
              />
            </section>

          </div>
        )}

        {/* Dedicated Supply View */}
        {activeTab === 'supply' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="font-display font-black text-xl tracking-wider text-slate-100">
                SOVEREIGN PER-CAPITA SUPPLY DASHBOARD
              </h2>
            </div>
            <SupplyDashboard
              supply={supply}
              onAdjustPopulation={handleAdjustPopulation}
              isUpdating={isUpdatingSupply}
            />
          </div>
        )}

        {/* Dedicated Nodes View */}
        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-teal-400" />
              <h2 className="font-display font-black text-xl tracking-wider text-slate-100">
                PEE DUB CORRIDOR SYNCHRONIZATION MONITOR (54-MIN TEMPORAL FRAMEWORK)
              </h2>
            </div>
            <CorridorVisualizer nodes={nodes} isPulsing={isPulsing} />
            <NodeMonitor
              nodes={nodes}
              temporalClock={temporalClock}
              onTriggerSyncPulse={handleTriggerSyncPulse}
              isPulsing={isPulsing}
            />
          </div>
        )}

        {/* Dedicated Bridge View */}
        {activeTab === 'bridge' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-black text-xl tracking-wider text-slate-100">
                CROSS-CHAIN BRIDGE GATEWAY & HTLC ATOMIC SWAP ENGINE
              </h2>
            </div>
            <BridgeGateway
              volatility={volatility}
              guardians={guardians}
              swaps={swaps}
              onExecuteSwap={handleExecuteSwap}
              isExecuting={isExecutingSwap}
            />
          </div>
        )}

      </main>

      {/* Footer & Ecosystem Attribution */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-500 font-mono-tech">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 clip-octagon bg-cyan-500/20 text-cyan-300 font-display font-bold flex items-center justify-center text-xs">
              D9
            </div>
            <div>
              <span className="text-slate-300 font-bold">Deniro 9 (D9) Ecosystem & Bridge Simulator</span>
              <p className="text-[11px] text-slate-500 font-body">
                5.3B Sovereign Cap • Pee Dub Corridor • Dragon 9 54-Minute Temporal Clock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Fluid Motion TV Framework</span>
            <span>•</span>
            <span className="text-teal-400">9 Hz Harmonic Resonance</span>
            <span>•</span>
            <span>HTLC SHA-256 Verified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
