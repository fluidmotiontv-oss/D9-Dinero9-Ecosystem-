import React from 'react';
import { Clock, Radio, Compass, Sparkles, Orbit } from 'lucide-react';
import { TemporalClock } from '../types';

interface TemporalClockCardProps {
  clock: TemporalClock | null;
}

export const TemporalClockCard: React.FC<TemporalClockCardProps> = ({ clock }) => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (!clock) {
    return (
      <div className="glass-panel p-6 rounded-2xl animate-pulse text-center">
        <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
        <p className="text-sm font-mono-tech text-cyan-300">Synchronizing with Dragon 9 Temporal Master Beacon...</p>
      </div>
    );
  }

  // Calculate angle for the 54-minute hour gauge (360 degrees for 54 minutes)
  const minuteAngle = (clock.d9Minute / 54) * 360;

  return (
    <div className="glass-panel-glow rounded-2xl p-5 sm:p-6 border border-cyan-500/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 clip-octagon bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '27s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 tracking-wide">
                DRAGON 9 TEMPORAL FRAMEWORK
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                54-Min Hour Standard
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body">
              Temporal synchronization beacon operating across the Pee Dub corridor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-mono-tech">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Harmonic:</span>
          <span className="text-emerald-400 font-bold">{clock.harmonicFrequency}.0 Hz Pulse</span>
        </div>
      </div>

      {/* Main Grid: Gauge & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: 54-Minute Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-800/80">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Octagonal Ring */}
            <div className="absolute inset-0 clip-octagon bg-gradient-to-tr from-cyan-500/30 via-slate-800 to-emerald-500/30 p-[1.5px]">
              <div className="w-full h-full clip-octagon bg-slate-950/90" />
            </div>

            {/* Circular SVG Gauge */}
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Track circle (54 increments) */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800/80 fill-none"
              />
              {/* Active Progress Circle */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="url(#d9-gauge-grad)"
                strokeWidth="6"
                strokeDasharray={376.99}
                strokeDashoffset={376.99 * (1 - clock.hourProgress / 100)}
                strokeLinecap="round"
                className="fill-none transition-all duration-1000"
              />
              <defs>
                <linearGradient id="d9-gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Digital Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono-tech text-cyan-400 tracking-wider">D9 CYCLE</span>
              <span className="text-2xl font-mono-tech font-black text-slate-100 tracking-tight">
                {pad(clock.d9Minute)}:{pad(clock.d9Second)}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400">
                / 54:00 MIN
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs font-mono-tech text-slate-300">
              Hour Progress: <span className="text-cyan-400 font-bold">{clock.hourProgress}%</span>
            </span>
            <div className="text-[10px] text-slate-500 font-body">
              {clock.secondsUntilNextD9Hour}s until D9 Hour rollover
            </div>
          </div>
        </div>

        {/* Right: 9 Harmonic Octaves & Corridor Beat */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-tech uppercase text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                9 Harmonic Octaves (6-min beats per octave)
              </span>
              <span className="text-xs font-mono-tech text-cyan-400 font-bold">
                Active Octave: {clock.currentOctave} of 9
              </span>
            </div>

            {/* 9-Segment Octave Bar */}
            <div className="grid grid-cols-9 gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
              {Array.from({ length: 9 }).map((_, idx) => {
                const octNum = idx + 1;
                const isPassed = octNum < clock.currentOctave;
                const isCurrent = octNum === clock.currentOctave;

                return (
                  <div key={octNum} className="flex flex-col items-center">
                    <div
                      className={`w-full h-8 rounded transition-all flex items-center justify-center text-[10px] font-mono-tech font-bold ${
                        isCurrent
                          ? 'bg-gradient-to-t from-cyan-600 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/40 animate-pulse'
                          : isPassed
                          ? 'bg-cyan-950/70 border border-cyan-800/50 text-cyan-300'
                          : 'bg-slate-900 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {octNum}
                    </div>
                    <span className="text-[9px] font-mono-tech text-slate-500 mt-1">
                      {octNum * 6}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Resonance Quality</div>
              <div className="text-base font-mono-tech font-bold text-emerald-400 flex items-center gap-1">
                {(clock.temporalResonance * 100).toFixed(1)}%
                <span className="text-[10px] text-slate-500">Φ-aligned</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Temporal Epoch</div>
              <div className="text-base font-mono-tech font-bold text-cyan-300">
                Epoch #{clock.temporalEpoch}
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono-tech text-slate-400 uppercase">Standard SI Drift</div>
              <div className="text-base font-mono-tech font-bold text-teal-400">
                -6.0 min / hr
                <span className="text-[10px] text-slate-500 block font-normal">(54m compression)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
