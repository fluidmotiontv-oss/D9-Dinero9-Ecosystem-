import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  Key, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Shield, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { HTLCSwap, VolatilityEngine, SovereignGuardian } from '../types';
import { PreimageModal } from './PreimageModal';

interface BridgeGatewayProps {
  volatility: VolatilityEngine | null;
  guardians: SovereignGuardian[];
  swaps: HTLCSwap[];
  onExecuteSwap: (amountD9: number, targetAsset: string, recipientAddress: string) => Promise<void>;
  isExecuting: boolean;
}

export const BridgeGateway: React.FC<BridgeGatewayProps> = ({
  volatility,
  guardians,
  swaps,
  onExecuteSwap,
  isExecuting,
}) => {
  const [amount, setAmount] = useState<number>(50000);
  const [targetAsset, setTargetAsset] = useState<string>('wD9-ETH');
  const [recipient, setRecipient] = useState<string>('0x71C83e...94F1e');
  const [selectedAuditSwap, setSelectedAuditSwap] = useState<HTLCSwap | null>(null);
  const [swapStep, setSwapStep] = useState<number>(0);

  const supportedAssets = [
    { code: 'wD9-ETH', chain: 'Ethereum Mainnet', standard: 'ERC-20', icon: '⟠' },
    { code: 'wD9-SOL', chain: 'Solana Network', standard: 'Token-2022', icon: '◎' },
    { code: 'wD9-ATOM', chain: 'Cosmos Hub', standard: 'IBC Protocol', icon: '⚛' },
    { code: 'wD9-POL', chain: 'Polygon zkEVM', standard: 'zk-Rollup', icon: '⬡' },
  ];

  // Calculate live dynamic fee dampening based on amount and volatility
  const baseFeePercent = volatility ? volatility.baseFee : 0.65;
  const rawFeeD9 = Math.round(amount * (baseFeePercent / 100));
  const subsidyPercent = volatility ? volatility.dampingSubsidyRate : 60;
  const sovereignSubsidy = Math.round(rawFeeD9 * (subsidyPercent / 100) * 0.72);
  const netFeeD9 = Math.max(5, rawFeeD9 - sovereignSubsidy);
  const netFeePercent = volatility ? volatility.dampenedFee : 0.28;
  const mintAmount = amount - netFeeD9;

  const handleQuickAmount = (val: number) => {
    setAmount(val);
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || isExecuting) return;

    // Trigger visual step progression
    setSwapStep(1); // Locking in Multi-Sig
    setTimeout(() => setSwapStep(2), 500); // HTLC Preimage & SHA256
    setTimeout(() => setSwapStep(3), 1000); // Guardian Quorum
    setTimeout(async () => {
      await onExecuteSwap(amount, targetAsset, recipient);
      setSwapStep(0);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Volatility Dampener Banner */}
      <div className="glass-panel-glow p-5 rounded-2xl border border-teal-500/30 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 clip-octagon bg-gradient-to-tr from-cyan-500 to-teal-400 p-[1.5px] flex-shrink-0">
              <div className="w-full h-full clip-octagon bg-slate-950 flex items-center justify-center text-teal-300">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-100">
                  SLIDING-SCALE VOLATILITY FEE DAMPENER
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-mono-tech rounded uppercase font-bold ${
                  volatility?.level === 'SEVERE'
                    ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                    : volatility?.level === 'SPIKE'
                    ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                }`}>
                  {volatility ? `${volatility.level} MARKET (${volatility.index}%)` : 'CALM (28%)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body">
                Sovereign escrow reserves automatically subsidize bridge turbulence to prevent liquidity runoffs
              </p>
            </div>
          </div>

          {/* Fee Comparison Metric Pill */}
          <div className="flex items-center gap-4 bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono-tech">
            <div>
              <span className="text-slate-500 block text-[9px]">UNCAPPED MARKET FEE</span>
              <span className="text-slate-400 line-through">{baseFeePercent}%</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            <div>
              <span className="text-emerald-400 block text-[9px]">DAMPENED EFFECTIVE FEE</span>
              <span className="text-emerald-300 font-bold text-sm">{netFeePercent}%</span>
            </div>
            <div className="pl-3 border-l border-slate-800">
              <span className="text-slate-500 block text-[9px]">SOVEREIGN REBATE</span>
              <span className="text-cyan-400 font-semibold">{volatility?.dampingSubsidyRate || 64}% Buffer</span>
            </div>
          </div>

        </div>

        {/* Dynamic Volatility Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1.5">
            <span>Harmonic Volatility Index: {volatility ? volatility.index : 32}%</span>
            <span className="text-teal-400">Sliding Dampener Active</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-500 transition-all duration-700"
              style={{ width: `${volatility ? volatility.index : 35}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Bridge Split: Interactive Simulation Panel & Sovereign Multi-Sig Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Swap Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 sm:p-6 rounded-2xl border-cyan-500/30">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h4 className="font-display font-bold text-base text-slate-100">
                HTLC ATOMIC SWAP SIMULATION GATEWAY
              </h4>
            </div>
            <span className="text-[10px] font-mono-tech text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/40">
              3-of-5 Multi-Sig Escrow
            </span>
          </div>

          <form onSubmit={handleExecute} className="space-y-4">
            
            {/* Source Asset (Fixed D9-NATIVE) */}
            <div>
              <label className="block text-xs font-mono-tech text-slate-400 mb-1.5">
                SOURCE ASSET (Escrowed in Sovereign Corridor Vault)
              </label>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 clip-octagon bg-cyan-500/20 text-cyan-300 font-display font-bold flex items-center justify-center text-xs">
                    D9
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 font-mono-tech">D9-NATIVE</div>
                    <div className="text-[10px] text-slate-400 font-body">New Zealand Sovereign Corridor Currency</div>
                  </div>
                </div>
                <span className="text-xs font-mono-tech text-cyan-400 font-bold">1:1 Parity</span>
              </div>
            </div>

            {/* Target Wrapped Asset Selection */}
            <div>
              <label className="block text-xs font-mono-tech text-slate-400 mb-1.5">
                TARGET WRAPPED ASSET (Minted via HTLC Preimage Release)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {supportedAssets.map((asset) => {
                  const isSelected = targetAsset === asset.code;
                  return (
                    <button
                      key={asset.code}
                      type="button"
                      onClick={() => setTargetAsset(asset.code)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{asset.icon}</span>
                        <span className="text-[9px] font-mono-tech text-slate-500 uppercase">{asset.standard}</span>
                      </div>
                      <div className="text-xs font-mono-tech font-bold text-slate-100">{asset.code}</div>
                      <div className="text-[9px] text-slate-400 font-body truncate">{asset.chain}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Input & Quick Select Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono-tech text-slate-400">
                  LOCK AMOUNT (D9 NOTES)
                </label>
                <div className="flex items-center gap-1">
                  {[10000, 50000, 100000, 250000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAmount(val)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 cursor-pointer"
                    >
                      {(val / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max="5000000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl text-lg font-mono-tech font-bold text-slate-100 outline-none transition-colors"
                  placeholder="Enter D9 Amount"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono-tech font-bold text-cyan-400">
                  D9 NOTES
                </span>
              </div>
            </div>

            {/* Recipient Address */}
            <div>
              <label className="block text-xs font-mono-tech text-slate-400 mb-1.5">
                RECIPIENT CONTRACT / WALLET DESTINATION
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs font-mono-tech text-slate-300 outline-none"
                placeholder="Target chain recipient address"
              />
            </div>

            {/* Fee Dampener & Mint Computation Breakdown */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono-tech">
              <div className="flex justify-between text-slate-400">
                <span>Standard Cross-Chain Volatility Fee:</span>
                <span className="line-through">{rawFeeD9} D9 ({baseFeePercent}%)</span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>Sovereign Escrow Dampener Buffer:</span>
                <span>-{sovereignSubsidy} D9 (Rebate)</span>
              </div>

              <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-slate-800">
                <span>Net Fee Paid:</span>
                <span className="text-teal-300">{netFeeD9} D9 ({netFeePercent}%)</span>
              </div>

              <div className="flex justify-between text-slate-100 font-bold text-sm pt-1 border-t border-slate-800">
                <span className="text-cyan-300">Total Wrapped Asset Minted:</span>
                <span className="text-cyan-400">{mintAmount.toLocaleString()} {targetAsset}</span>
              </div>
            </div>

            {/* Simulated Step Execution Notification */}
            {swapStep > 0 && (
              <div className="p-3 bg-cyan-950/80 rounded-xl border border-cyan-500/40 text-xs font-mono-tech text-cyan-300 animate-pulse flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {swapStep === 1 && 'Step 1/3: Locking D9 notes in 3-of-5 Sovereign Escrow...'}
                  {swapStep === 2 && 'Step 2/3: Generating SHA-256 Hash Lock & 54m Timelock...'}
                  {swapStep === 3 && 'Step 3/3: Reaching Guardian Quorum & Minting Wrapped Asset...'}
                </span>
              </div>
            )}

            {/* Execute Button */}
            <button
              type="submit"
              disabled={isExecuting || amount <= 0 || swapStep > 0}
              className="w-full py-3.5 rounded-xl clip-octagon bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-display font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>
                {isExecuting || swapStep > 0
                  ? 'Executing Simulated Atomic Swap...'
                  : `Lock D9 & Mint ${targetAsset}`}
              </span>
            </button>

            <div className="text-[10px] font-mono-tech text-slate-500 text-center flex items-center justify-center gap-2">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Timelock: 54 Dragon Minutes • Automated Refund on Expiry</span>
            </div>

          </form>
        </div>

        {/* Right Column: Multi-Sig Escrow Guardians & Mechanism Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Sovereign Multi-Sig Vault Status */}
          <div className="glass-panel p-5 rounded-2xl border-teal-500/30">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <h4 className="font-display font-bold text-sm text-slate-100">
                SOVEREIGN MULTI-SIG GUARDIANS (3-OF-5)
              </h4>
            </div>

            <p className="text-xs text-slate-400 font-body mb-4">
              Cross-chain wrapped D9 minting strictly requires at least 3 of 5 independent sovereign keys to authorize counterparty escrow locks.
            </p>

            {/* Guardians list */}
            <div className="space-y-2">
              {guardians.map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono-tech"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-200 text-[11px] font-medium">{g.name}</span>
                  </div>
                  <span className="text-[10px] text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800/40">
                    ONLINE
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono-tech text-slate-400">
              <span>Threshold Status:</span>
              <span className="text-emerald-400 font-bold">5 of 5 Keys Participating</span>
            </div>
          </div>

          {/* HTLC Protocol Specifications Card */}
          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <h4 className="font-display font-bold text-sm text-slate-100 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              HTLC ATOMIC SWAP SPECIFICATION
            </h4>
            <div className="space-y-2 text-xs font-body text-slate-400">
              <p>
                • <strong className="text-slate-200">Preimage Hash Lock:</strong> Generates a SHA-256 hash digest of a cryptographically random secret in the browser/node runtime.
              </p>
              <p>
                • <strong className="text-slate-200">54-Min Timelock Window:</strong> Aligns perfectly with one Dragon 9 temporal hour (3,240 SI seconds).
              </p>
              <p>
                • <strong className="text-slate-200">Zero Third-Party Custody:</strong> If the counterparty fails to reveal the preimage before the 54-minute block limit, funds return to the sovereign corridor vault automatically.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Simulated HTLC Swaps Ledger */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="font-display font-bold text-base text-slate-100">
              RECENT CROSS-CHAIN HTLC ATOMIC SWAPS LEDGER
            </h4>
          </div>
          <span className="text-xs font-mono-tech text-slate-400">
            {swaps.length} Swaps Recorded
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs font-mono-tech border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="pb-2.5 font-medium">SWAP ID / TIME</th>
                <th className="pb-2.5 font-medium">SOURCE / TARGET</th>
                <th className="pb-2.5 font-medium">LOCKED D9</th>
                <th className="pb-2.5 font-medium">WRAPPED MINT</th>
                <th className="pb-2.5 font-medium">FEE & BUFFER</th>
                <th className="pb-2.5 font-medium">TIMELOCK / STATUS</th>
                <th className="pb-2.5 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {swaps.map((swap) => (
                <tr key={swap.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3">
                    <div className="text-slate-200 font-bold">{swap.id}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(swap.createdAt).toLocaleTimeString()}
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="text-slate-200">{swap.sourceAsset}</div>
                    <div className="text-[10px] text-cyan-400">→ {swap.targetAsset}</div>
                  </td>

                  <td className="py-3 text-slate-200 font-bold">
                    {swap.amountD9.toLocaleString()} D9
                  </td>

                  <td className="py-3 text-teal-300 font-bold">
                    {swap.wrappedMintAmount.toLocaleString()} {swap.targetAsset}
                  </td>

                  <td className="py-3">
                    <div className="text-slate-300">{swap.netFeeD9} D9 ({swap.dampenedFeePercent}%)</div>
                    <div className="text-[10px] text-emerald-400">+{swap.sovereignSubsidyAmount} D9 Buffered</div>
                  </td>

                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{swap.status}</span>
                    </span>
                    <div className="text-[9px] text-slate-500 mt-0.5">54m HTLC Timelock</div>
                  </td>

                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedAuditSwap(swap)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-[10px] cursor-pointer inline-flex items-center gap-1 transition-colors"
                    >
                      <Key className="w-3 h-3" />
                      <span>Audit Key</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preimage Cryptographic Audit Modal */}
      {selectedAuditSwap && (
        <PreimageModal
          swap={selectedAuditSwap}
          onClose={() => setSelectedAuditSwap(null)}
        />
      )}

    </div>
  );
};
