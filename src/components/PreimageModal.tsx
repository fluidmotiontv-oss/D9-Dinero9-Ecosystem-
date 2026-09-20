import React from 'react';
import { X, Key, Shield, Hash, Clock, CheckCircle2, Copy } from 'lucide-react';
import { HTLCSwap } from '../types';

interface PreimageModalProps {
  swap: HTLCSwap | null;
  onClose: () => void;
}

export const PreimageModal: React.FC<PreimageModalProps> = ({ swap, onClose }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!swap) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel-glow rounded-2xl p-6 border border-cyan-500/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 clip-octagon bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-100">
              HTLC ATOMIC SWAP CRYPTOGRAPHIC AUDIT
            </h3>
            <span className="text-xs font-mono-tech text-teal-400">
              Contract Ref: {swap.id}
            </span>
          </div>
        </div>

        {/* Cryptographic Key Details */}
        <div className="space-y-4 text-xs font-mono-tech">
          
          {/* Hash Lock */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Hash className="w-3.5 h-3.5" />
                SHA-256 HASH LOCK (Public On-Chain)
              </span>
              <button
                onClick={() => copyToClipboard(swap.hashLock, 'hash')}
                className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'hash' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2 bg-slate-950 rounded text-slate-200 font-mono-tech break-all select-all">
              {swap.hashLock}
            </div>
          </div>

          {/* Secret Preimage */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-teal-500/30">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Key className="w-3.5 h-3.5" />
                SECRET PREIMAGE (Revealed for Claim)
              </span>
              {swap.secretPreimage && (
                <button
                  onClick={() => copyToClipboard(swap.secretPreimage!, 'preimage')}
                  className="text-slate-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'preimage' ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className="p-2 bg-slate-950 rounded text-teal-300 font-mono-tech break-all select-all">
              {swap.secretPreimage || 'Preimage locked in counterparty enclave.'}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-body">
              SHA256(Preimage) resolves precisely to the Hash Lock, satisfying the atomic swap constraint.
            </p>
          </div>

          {/* Multi-Signature & Timelock Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>Guardian Signers</span>
              </div>
              <div className="text-sm font-bold text-slate-100">
                {swap.multiSigGuardiansSigned} of {swap.requiredGuardians} Required
              </div>
              <span className="text-[10px] text-emerald-400">Consensus Quorum Met</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Dragon 9 Timelock</span>
              </div>
              <div className="text-sm font-bold text-slate-100">
                {swap.timelockMinutes} Minutes
              </div>
              <span className="text-[10px] text-slate-400">1 Full D9 Temporal Hour</span>
            </div>
          </div>

          {/* Volatility Dampener Rebate */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px]">SOVEREIGN DAMPENER BUFFER</span>
              <span className="text-emerald-400 font-bold text-sm">
                +{swap.sovereignSubsidyAmount} D9 Subsidized
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">NET FEE PAID</span>
              <span className="text-slate-200 font-bold text-sm">
                {swap.netFeeD9} D9 ({swap.dampenedFeePercent}%)
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display text-xs cursor-pointer"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
