import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Users, 
  Sliders, 
  CheckCircle2, 
  Hash, 
  TrendingUp, 
  Coins, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SupplyState } from '../types';

interface SupplyDashboardProps {
  supply: SupplyState | null;
  onAdjustPopulation: (newPop: number) => Promise<void>;
  isUpdating: boolean;
}

export const SupplyDashboard: React.FC<SupplyDashboardProps> = ({
  supply,
  onAdjustPopulation,
  isUpdating,
}) => {
  const [customPop, setCustomPop] = useState<number>(supply ? supply.population : 5302400);
  const [showAdjustPanel, setShowAdjustPanel] = useState<boolean>(false);

  if (!supply) {
    return (
      <div className="glass-panel p-8 rounded-2xl animate-pulse text-center">
        <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-spin" />
        <p className="font-mono-tech text-cyan-300">Auditing New Zealand Sovereign Escrow Vaults...</p>
      </div>
    );
  }

  const formatNumber = (n: number) => new Intl.NumberFormat('en-NZ').format(n);
  const formatBillions = (n: number) => (n / 1000000000).toFixed(4) + 'B D9';
  const formatMillions = (n: number) => (n / 1000000).toFixed(2) + 'M D9';

  const escrowsList = [
    {
      key: 'sovereignTreasury',
      name: 'Sovereign Treasury Escrow',
      data: supply.escrows.sovereignTreasury,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      description: 'Long-term sovereign wealth & national infrastructure stabilization.',
    },
    {
      key: 'directCitizenAllotment',
      name: 'Direct Citizen Allotment',
      data: supply.escrows.directCitizenAllotment,
      color: 'from-teal-400 to-emerald-500',
      textColor: 'text-teal-400',
      description: 'Guaranteed 1,000 D9 entitlement per verified citizen identity.',
    },
    {
      key: 'liquidCorridorCirculation',
      name: 'Liquid Corridor Circulation',
      data: supply.escrows.liquidCorridorCirculation,
      color: 'from-emerald-400 to-lime-500',
      textColor: 'text-emerald-400',
      description: 'Active peer-to-peer settlement along the Pee Dub corridor.',
    },
    {
      key: 'bridgeCollateralReserve',
      name: 'Bridge Collateral Reserve',
      data: supply.escrows.bridgeCollateralReserve,
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-400',
      description: 'Backing multi-sig collateral for cross-chain wrapped assets.',
    },
    {
      key: 'heritageStakingPool',
      name: 'Heritage & Ecological Staking',
      data: supply.escrows.heritageStakingPool,
      color: 'from-purple-400 to-pink-500',
      textColor: 'text-purple-400',
      description: 'Dedicated conservation, indigenous guardianship & ecological pulse.',
    },
  ];

  const handlePopulationSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPop(Number(e.target.value));
  };

  const handleApplyPopulation = async () => {
    await onAdjustPopulation(customPop);
    setShowAdjustPanel(false);
  };

  const handleResetToBaseline = async () => {
    setCustomPop(5302400);
    await onAdjustPopulation(5302400);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Per-Capita Cap Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Total Sovereign Ceiling */}
        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech uppercase text-slate-400">
              National Supply Ceiling
            </span>
            <div className="w-7 h-7 clip-octagon bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-tech font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-200">
            {formatBillions(supply.supplyCeiling)}
          </div>
          <p className="text-xs text-slate-400 font-body mt-1">
            Absolute algorithmic ceiling: <span className="text-cyan-400 font-semibold">1,000 D9</span> notes per citizen
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-tech text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Hardcoded 5.3B Target Formula Enforced</span>
          </div>
        </div>

        {/* Card 2: New Zealand Population Cap Ratio */}
        <div className="glass-panel p-5 rounded-2xl border-teal-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech uppercase text-slate-400">
              NZ Population Reference
            </span>
            <button
              onClick={() => setShowAdjustPanel(!showAdjustPanel)}
              className="text-xs font-mono-tech text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-teal-950/60 px-2 py-1 rounded border border-teal-800/60 cursor-pointer"
            >
              <Sliders className="w-3 h-3" />
              <span>{showAdjustPanel ? 'Hide Sim' : 'Simulate Pop'}</span>
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-tech font-extrabold text-slate-100 flex items-center gap-2">
            {formatNumber(supply.population)}
            <span className="text-xs font-body font-normal text-slate-400">citizens</span>
          </div>
          <p className="text-xs text-slate-400 font-body mt-1">
            Census Ratio: <span className="text-teal-400 font-semibold">{supply.perCapitaRate} D9</span> notes per capita
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-400">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>Aotearoa / New Zealand Territorial Domain</span>
          </div>
        </div>

        {/* Card 3: Sovereign Escrow Locked Ratio */}
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech uppercase text-slate-400">
              Sovereign Escrow Status
            </span>
            <div className="w-7 h-7 clip-octagon bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-tech font-extrabold text-emerald-400">
            {supply.escrowLockedRatioPercent}%
            <span className="text-sm font-body font-normal text-slate-400 ml-2">Locked</span>
          </div>
          <p className="text-xs text-slate-400 font-body mt-1">
            Circulating in Pee Dub: <span className="text-slate-200 font-semibold">{supply.circulatingRatioPercent}%</span> ({formatMillions(supply.circulatingSupply)})
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-tech text-teal-400">
            <Shield className="w-3 h-3" />
            <span>Multi-Signature Custodian Consensus</span>
          </div>
        </div>
      </div>

      {/* Optional Interactive Simulation Panel for Population Recalibration */}
      {showAdjustPanel && (
        <div className="glass-panel-glow p-5 rounded-2xl border border-teal-500/40 animate-fluid-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <h4 className="font-display font-bold text-sm text-slate-100">
                POPULATION CEILING RECALIBRATION SIMULATOR
              </h4>
            </div>
            <button
              onClick={handleResetToBaseline}
              disabled={isUpdating}
              className="text-xs font-mono-tech text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Reset to 5.302M Baseline
            </button>
          </div>

          <p className="text-xs text-slate-300 font-body mb-4">
            Adjust the simulated New Zealand population to test how the sovereign architecture automatically scales the 1,000 D9/capita monetary ceiling and preserves escrow proportions.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-slate-400">Simulated Population:</span>
              <span className="text-teal-300 font-bold text-sm">{formatNumber(customPop)} citizens</span>
            </div>

            <input
              type="range"
              min="4500000"
              max="6500000"
              step="25000"
              value={customPop}
              onChange={handlePopulationSliderChange}
              className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-500">
              <span>4.50M (-800k)</span>
              <span>Baseline: 5.302M (5.3B Cap)</span>
              <span>6.50M (+1.2M)</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAdjustPanel(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono-tech text-slate-400 hover:bg-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPopulation}
                disabled={isUpdating}
                className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-display font-bold text-xs shadow-md shadow-teal-500/30 cursor-pointer transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Recalibrating Vaults...' : 'Apply Dynamic Ceiling'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proportional Escrow Multi-Tier Allocation Bar */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              SOVEREIGN ESCROW ARCHITECTURE & ALLOCATION TIERS
            </h3>
            <p className="text-xs text-slate-400 font-body">
              Algorithmic reserve distribution anchored to the 5.3B per-capita ceiling
            </p>
          </div>
          <div className="text-xs font-mono-tech text-slate-400">
            Total Vault: <span className="text-cyan-400 font-bold">{formatBillions(supply.supplyCeiling)}</span>
          </div>
        </div>

        {/* Multi-Segment Stacked Progress Bar */}
        <div className="w-full h-5 rounded-lg overflow-hidden bg-slate-900 flex p-0.5 border border-slate-800 gap-0.5 mb-6">
          {escrowsList.map((item) => (
            <div
              key={item.key}
              style={{ width: `${item.data.percentage}%` }}
              className={`h-full bg-gradient-to-r ${item.color} relative group transition-all duration-500`}
              title={`${item.name}: ${item.data.percentage}% (${formatMillions(item.data.amount)})`}
            />
          ))}
        </div>

        {/* Escrow Lock State Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {escrowsList.map((item) => {
            const isCirculating = !item.data.locked;
            return (
              <div
                key={item.key}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  isCirculating
                    ? 'bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono-tech font-bold text-slate-200 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono-tech text-slate-500">
                      {item.data.percentage}% of Cap
                    </span>
                  </div>

                  {/* Lock badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono-tech rounded ${
                      isCirculating
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-950 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {isCirculating ? (
                      <>
                        <Unlock className="w-3 h-3" />
                        <span>Circulating</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Escrow Locked</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xl font-mono-tech font-bold text-slate-100 my-1">
                  {formatMillions(item.data.amount)}
                </div>

                <p className="text-xs text-slate-400 font-body mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                  <span>Signer Authority:</span>
                  <span className="text-slate-300">{item.data.guardianCount}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cryptographic Sovereign Validation Hash Stamp */}
        <div className="mt-6 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-slate-400">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span>Sovereign Cap Validation Hash:</span>
            <span className="text-cyan-300 font-bold tracking-wider break-all">
              {supply.sovereignValidationHash}
            </span>
          </div>

          <div className="text-slate-500 text-[11px] whitespace-nowrap">
            Last Census Sync: {new Date(supply.lastCensusSync).toLocaleTimeString()}
          </div>
        </div>

      </div>

    </div>
  );
};
