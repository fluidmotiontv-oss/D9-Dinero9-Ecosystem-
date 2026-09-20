import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// DENIRO 9 (D9) ECOSYSTEM SIMULATION STATE
// ==========================================

// 1. Per-Capita Supply & Escrow State (New Zealand 5.3 Billion D9 Ceiling)
// 1,000 D9 notes per capita based on ~5,302,400 population
interface SupplyState {
  population: number;
  perCapitaRate: number; // 1,000 D9 per citizen
  supplyCeiling: number; // population * perCapitaRate (5.3B cap)
  circulatingSupply: number;
  escrows: {
    sovereignTreasury: { amount: number; percentage: number; locked: boolean; guardianCount: string };
    directCitizenAllotment: { amount: number; percentage: number; locked: boolean; guardianCount: string };
    liquidCorridorCirculation: { amount: number; percentage: number; locked: boolean; guardianCount: string };
    bridgeCollateralReserve: { amount: number; percentage: number; locked: boolean; guardianCount: string };
    heritageStakingPool: { amount: number; percentage: number; locked: boolean; guardianCount: string };
  };
  lastCensusSync: string;
  sovereignValidationHash: string;
}

let supplyState: SupplyState = {
  population: 5302400,
  perCapitaRate: 1000,
  supplyCeiling: 5302400000, // 5.3024 Billion D9 Ceiling
  circulatingSupply: 795360000, // 15% circulating in Pee Dub corridor
  escrows: {
    sovereignTreasury: {
      amount: 2120960000,
      percentage: 40,
      locked: true,
      guardianCount: '5-of-5 Sovereign Consensus',
    },
    directCitizenAllotment: {
      amount: 1590720000,
      percentage: 30,
      locked: true,
      guardianCount: '3-of-5 Biometric Escrow',
    },
    liquidCorridorCirculation: {
      amount: 795360000,
      percentage: 15,
      locked: false,
      guardianCount: 'Pee Dub Active Settlement',
    },
    bridgeCollateralReserve: {
      amount: 530240000,
      percentage: 10,
      locked: true,
      guardianCount: '3-of-5 Multi-Sig HTLC Vault',
    },
    heritageStakingPool: {
      amount: 265120000,
      percentage: 5,
      locked: true,
      guardianCount: '4-of-5 Ecological Custodians',
    },
  },
  lastCensusSync: new Date().toISOString(),
  sovereignValidationHash: '0x9d9e54a1a07409bc221f7c8d9e11894a02c91b7e',
};

// 2. Dragon 9 54-Minute Hourly Temporal Framework
// In the D9 temporal model: 1 Hour = 54 Minutes (3,240 SI seconds).
// 1 Dragon 9 Day = 26.66 D9 Hours (or 9 harmonic cycles).
function getDragon9TemporalClock() {
  const now = new Date();
  const epochOrigin = new Date('2026-01-01T00:00:00Z').getTime();
  const elapsedSeconds = Math.floor((now.getTime() - epochOrigin) / 1000);
  
  const d9HourSeconds = 54 * 60; // 3,240 seconds per D9 hour
  const totalD9Hours = Math.floor(elapsedSeconds / d9HourSeconds);
  const currentHourSeconds = elapsedSeconds % d9HourSeconds;
  
  const d9Minute = Math.floor(currentHourSeconds / 60); // 0 - 53
  const d9Second = currentHourSeconds % 60; // 0 - 59
  
  // Progress within the 54-minute hour (0 - 100%)
  const hourProgress = (currentHourSeconds / d9HourSeconds) * 100;
  
  // 9 Harmonic temporal octaves (each 6 minutes = 360 seconds)
  const currentOctave = Math.floor(d9Minute / 6) + 1; // 1 - 9
  const octaveProgress = ((currentHourSeconds % 360) / 360) * 100;
  
  // Synchronized Harmonic Beat (9 Hz baseline frequency pulse)
  const harmonicFrequency = 9.0;
  const temporalResonance = +(0.94 + 0.05 * Math.sin(now.getTime() / 4500)).toFixed(4);
  
  return {
    isoTime: now.toISOString(),
    d9Hour: totalD9Hours % 24,
    d9Minute,
    d9Second,
    hourProgress: +hourProgress.toFixed(2),
    currentOctave,
    totalOctaves: 9,
    octaveProgress: +octaveProgress.toFixed(2),
    harmonicFrequency,
    temporalResonance,
    secondsUntilNextD9Hour: d9HourSeconds - currentHourSeconds,
    temporalEpoch: Math.floor(totalD9Hours / 54) + 1,
    tickRate: '54m Synchronized Epoch',
  };
}

// 3. Pee Dub Corridor Node Synchronization Network
interface PeeDubNode {
  id: string;
  name: string;
  location: string;
  corridorKm: number; // distance along Pee Dub corridor from Wellington Citadel
  role: 'Consensus Master' | 'Corridor Mesh' | 'Sonic Repeater' | 'Liquidity Sentinel' | 'State Verifier' | 'Inland Nexus';
  status: 'synchronized' | 'harmonizing' | 'pulse-broadcasting';
  latencyMs: number;
  temporalDriftMs: number; // ms offset from master 54m clock
  blockHeight: number;
  harmonicWeight: number; // percentage
  peersConnected: number;
  lastPulseTime: string;
}

let peeDubNodes: PeeDubNode[] = [
  {
    id: 'PW-01-WLG',
    name: 'Te Whanganui Harbor Genesis Citadel',
    location: 'Wellington Central (PW South Terminal)',
    corridorKm: 0,
    role: 'Consensus Master',
    status: 'synchronized',
    latencyMs: 1.8,
    temporalDriftMs: 0.12,
    blockHeight: 9540821,
    harmonicWeight: 24.5,
    peersConnected: 48,
    lastPulseTime: new Date().toISOString(),
  },
  {
    id: 'PW-02-POR',
    name: 'Porirua Inlet Harmonic Node',
    location: 'Porirua Basin',
    corridorKm: 21,
    role: 'Corridor Mesh',
    status: 'synchronized',
    latencyMs: 3.4,
    temporalDriftMs: 0.38,
    blockHeight: 9540821,
    harmonicWeight: 14.2,
    peersConnected: 36,
    lastPulseTime: new Date().toISOString(),
  },
  {
    id: 'PW-03-PKB',
    name: 'Paekakariki Coastal Sonic Repeater',
    location: 'Paekakariki Escarpment',
    corridorKm: 42,
    role: 'Sonic Repeater',
    status: 'synchronized',
    latencyMs: 4.1,
    temporalDriftMs: -0.22,
    blockHeight: 9540820,
    harmonicWeight: 9.8,
    peersConnected: 28,
    lastPulseTime: new Date().toISOString(),
  },
  {
    id: 'PW-04-KAP',
    name: 'Kapiti Coast Liquidity Sentinel',
    location: 'Paraparaumu Gateway',
    corridorKm: 55,
    role: 'Liquidity Sentinel',
    status: 'synchronized',
    latencyMs: 4.7,
    temporalDriftMs: 0.45,
    blockHeight: 9540821,
    harmonicWeight: 16.0,
    peersConnected: 42,
    lastPulseTime: new Date().toISOString(),
  },
  {
    id: 'PW-05-OTK',
    name: 'Otaki River Temporal Gate',
    location: 'Otaki Sector',
    corridorKm: 76,
    role: 'State Verifier',
    status: 'harmonizing',
    latencyMs: 6.2,
    temporalDriftMs: 0.82,
    blockHeight: 9540819,
    harmonicWeight: 8.4,
    peersConnected: 22,
    lastPulseTime: new Date().toISOString(),
  },
  {
    id: 'PW-06-LEV',
    name: 'Horowhenua Agricultural Escrow Node',
    location: 'Levin Agricultural Plains',
    corridorKm: 98,
    role: 'Corridor Mesh',
    status: 'synchronized',
    latencyMs: 7.0,
    temporalDriftMs: -0.19,
    blockHeight: 9540821,
    harmonicWeight: 11.5,
    peersConnected: 30,
    lastPulseTime: new Date().toISOString(),
  },
  {
    id: 'PW-07-PMN',
    name: 'Palmerston North Inland Nexus',
    location: 'Palmerston North (PW North Terminal)',
    corridorKm: 140,
    role: 'Inland Nexus',
    status: 'synchronized',
    latencyMs: 8.5,
    temporalDriftMs: 0.28,
    blockHeight: 9540821,
    harmonicWeight: 15.6,
    peersConnected: 44,
    lastPulseTime: new Date().toISOString(),
  },
];

// 4. Cross-Chain Bridge Gateway & HTLC Swap Engine
interface HTLCSwap {
  id: string;
  sourceAsset: 'D9-NATIVE';
  targetAsset: 'wD9-ETH' | 'wD9-SOL' | 'wD9-ATOM' | 'wD9-POL';
  amountD9: number;
  wrappedMintAmount: number;
  recipientAddress: string;
  hashLock: string; // SHA-256 hash
  secretPreimage?: string; // Revealed upon claim
  timelockMinutes: number; // 54 minutes Dragon 9 standard
  timelockExpiry: string;
  multiSigGuardiansSigned: number;
  requiredGuardians: number; // 3 of 5
  volatilityIndex: number; // e.g. 28.5%
  baseFeePercent: number;
  dampenedFeePercent: number;
  sovereignSubsidyAmount: number;
  netFeeD9: number;
  status: 'PENDING_ESCROW' | 'ESCROW_LOCKED' | 'PREIMAGE_SUBMITTED' | 'MINTED_COMPLETED' | 'REFUNDED';
  createdAt: string;
  txHash: string;
}

// Guardians of the Sovereign Multi-Sig Vault
const SOVEREIGN_GUARDIANS = [
  { id: 'G-01', name: 'Te Whanganui-a-Tara Sovereign Key', status: 'ACTIVE', weight: 1 },
  { id: 'G-02', name: 'Pee Dub Corridor Consensus Multi-Sig', status: 'ACTIVE', weight: 1 },
  { id: 'G-03', name: 'Aotearoa Reserve Stability Trustee', status: 'ACTIVE', weight: 1 },
  { id: 'G-04', name: 'HTLC Cryptographic Arbiter', status: 'ACTIVE', weight: 1 },
  { id: 'G-05', name: 'Liquid Vault Sentinel', status: 'ACTIVE', weight: 1 },
];

let bridgeSwaps: HTLCSwap[] = [
  {
    id: 'SWAP-D9-9801',
    sourceAsset: 'D9-NATIVE',
    targetAsset: 'wD9-ETH',
    amountD9: 250000,
    wrappedMintAmount: 249050,
    recipientAddress: '0x71C...49b2E1',
    hashLock: '0x4f2b968a91df7976e191b92019c4d924d547ba50e7b89d81d2a13f6409ef9213',
    secretPreimage: '0xd9_secret_corridor_pw_temporal_sync_alpha_9',
    timelockMinutes: 54,
    timelockExpiry: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    multiSigGuardiansSigned: 4,
    requiredGuardians: 3,
    volatilityIndex: 38.4,
    baseFeePercent: 0.85,
    dampenedFeePercent: 0.38,
    sovereignSubsidyAmount: 1175,
    netFeeD9: 950,
    status: 'MINTED_COMPLETED',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    txHash: '0x3a82f...e771c',
  },
  {
    id: 'SWAP-D9-9802',
    sourceAsset: 'D9-NATIVE',
    targetAsset: 'wD9-SOL',
    amountD9: 100000,
    wrappedMintAmount: 99650,
    recipientAddress: '7v9...PwD9Sol',
    hashLock: '0xb892a012de94132ff87c2901a88b54902cd51a67ec49103e911df130a84b2c12',
    secretPreimage: '0xdragon9_sol_bridge_preimage_77',
    timelockMinutes: 54,
    timelockExpiry: new Date(Date.now() + 32 * 60 * 1000).toISOString(),
    multiSigGuardiansSigned: 3,
    requiredGuardians: 3,
    volatilityIndex: 42.1,
    baseFeePercent: 0.92,
    dampenedFeePercent: 0.35,
    sovereignSubsidyAmount: 570,
    netFeeD9: 350,
    status: 'MINTED_COMPLETED',
    createdAt: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
    txHash: '0x992cf...4b01a',
  },
];

// Volatility index calculation with 54-minute harmonic waveform
function getLiveVolatilityIndex(): {
  index: number;
  level: 'CALM' | 'ELEVATED' | 'SPIKE' | 'SEVERE';
  dampingSubsidyRate: number;
  baseFee: number;
  dampenedFee: number;
} {
  const clock = getDragon9TemporalClock();
  // Harmonic cycle wave combining 54-min cycle with micro waves
  const wave = Math.sin((clock.hourProgress / 100) * Math.PI * 2);
  const micro = Math.cos(Date.now() / 8000) * 4;
  const index = Math.max(12, Math.min(88, +(34 + wave * 16 + micro).toFixed(1)));

  let level: 'CALM' | 'ELEVATED' | 'SPIKE' | 'SEVERE' = 'CALM';
  if (index >= 60) level = 'SEVERE';
  else if (index >= 45) level = 'SPIKE';
  else if (index >= 28) level = 'ELEVATED';

  // Base fee expands during market volatility
  const baseFee = +(0.35 + (index / 100) * 1.2).toFixed(3); // 0.35% to 1.4%
  // Volatility fee dampener: absorbs the volatility shock with a sovereign reserve subsidy
  const dampingSubsidyRate = +(0.55 + (index / 100) * 0.3).toFixed(2); // 55% - 81% subsidy
  const dampenedFee = +(baseFee * (1 - dampingSubsidyRate * 0.72)).toFixed(3); // dampened down to ~0.25% - 0.45%

  return {
    index,
    level,
    dampingSubsidyRate: +(dampingSubsidyRate * 100).toFixed(1),
    baseFee,
    dampenedFee,
  };
}

// Background simulation ticker: subtle node drift and block advancement
setInterval(() => {
  peeDubNodes = peeDubNodes.map((node) => {
    // Random subtle block height advance
    const advance = Math.random() > 0.65 ? 1 : 0;
    // Micro jitter on temporal drift (-0.05ms to +0.05ms)
    const jitter = (Math.random() - 0.5) * 0.04;
    const newDrift = +(node.temporalDriftMs + jitter).toFixed(3);
    const latencyJitter = (Math.random() - 0.5) * 0.3;
    const newLatency = Math.max(1.2, +(node.latencyMs + latencyJitter).toFixed(1));

    return {
      ...node,
      blockHeight: node.blockHeight + advance,
      temporalDriftMs: Math.abs(newDrift) > 1.2 ? +(newDrift * 0.6).toFixed(3) : newDrift,
      latencyMs: newLatency,
      lastPulseTime: new Date().toISOString(),
    };
  });
}, 3000);

// ==========================================
// REST API ENDPOINTS
// ==========================================

// System Status Overview
app.get('/api/status', (req: Request, res: Response) => {
  const temporalClock = getDragon9TemporalClock();
  const vol = getLiveVolatilityIndex();
  res.json({
    system: 'Deniro 9 (D9) Ecosystem & Liquidity Bridge',
    status: 'ONLINE_HARMONIZED',
    temporalClock,
    supplySummary: {
      population: supplyState.population,
      supplyCeiling: supplyState.supplyCeiling,
      circulatingSupply: supplyState.circulatingSupply,
      sovereignLockedSupply: supplyState.supplyCeiling - supplyState.circulatingSupply,
      capRatio: '1,000 D9 / Capita',
      ceilingCapFormatted: '5.3024 Billion D9',
    },
    volatilityEngine: vol,
    nodeNetwork: {
      activeNodes: peeDubNodes.length,
      corridorSpanKm: 140,
      corridor: 'Pee Dub (Wellington - Horowhenua - Palmerston North Corridor)',
      averageDriftMs: +(
        peeDubNodes.reduce((acc, n) => acc + Math.abs(n.temporalDriftMs), 0) / peeDubNodes.length
      ).toFixed(3),
    },
    bridgeOverview: {
      totalSwapsExecuted: bridgeSwaps.length,
      totalVolumeBridgedD9: bridgeSwaps.reduce((acc, s) => acc + s.amountD9, 0),
      escrowCollateralLocked: supplyState.escrows.bridgeCollateralReserve.amount,
      guardiansActive: `${SOVEREIGN_GUARDIANS.length} of ${SOVEREIGN_GUARDIANS.length}`,
    },
  });
});

// 1. Temporal Clock API
app.get('/api/temporal-clock', (req: Request, res: Response) => {
  res.json(getDragon9TemporalClock());
});

// 2. Per-Capita Supply & Escrow API
app.get('/api/supply-cap', (req: Request, res: Response) => {
  const sovereignLocked = Object.values(supplyState.escrows)
    .filter((e) => e.locked)
    .reduce((sum, e) => sum + e.amount, 0);

  res.json({
    ...supplyState,
    totalEscrowLockedD9: sovereignLocked,
    circulatingRatioPercent: +((supplyState.circulatingSupply / supplyState.supplyCeiling) * 100).toFixed(2),
    escrowLockedRatioPercent: +((sovereignLocked / supplyState.supplyCeiling) * 100).toFixed(2),
    notesPerCapitaMax: supplyState.perCapitaRate,
  });
});

// Adjust Population / Recalibrate Ceiling simulation
app.post('/api/supply-cap/adjust-population', (req: Request, res: Response) => {
  const { populationDelta, newPopulation } = req.body;
  if (newPopulation && typeof newPopulation === 'number' && newPopulation > 1000000) {
    supplyState.population = Math.round(newPopulation);
  } else if (populationDelta && typeof populationDelta === 'number') {
    supplyState.population = Math.max(1000000, supplyState.population + Math.round(populationDelta));
  }

  // Recalculate 5.3B per-capita ceiling
  supplyState.supplyCeiling = supplyState.population * supplyState.perCapitaRate;
  
  // Distribute proportions
  supplyState.escrows.sovereignTreasury.amount = Math.round(supplyState.supplyCeiling * 0.40);
  supplyState.escrows.directCitizenAllotment.amount = Math.round(supplyState.supplyCeiling * 0.30);
  supplyState.escrows.liquidCorridorCirculation.amount = Math.round(supplyState.supplyCeiling * 0.15);
  supplyState.escrows.bridgeCollateralReserve.amount = Math.round(supplyState.supplyCeiling * 0.10);
  supplyState.escrows.heritageStakingPool.amount = Math.round(supplyState.supplyCeiling * 0.05);
  supplyState.circulatingSupply = supplyState.escrows.liquidCorridorCirculation.amount;
  supplyState.lastCensusSync = new Date().toISOString();
  supplyState.sovereignValidationHash = '0x' + crypto.randomBytes(20).toString('hex');

  res.json({
    success: true,
    message: 'New Zealand population cap ratio recalibrated successfully.',
    supplyState,
  });
});

// 3. Pee Dub Corridor Nodes API
app.get('/api/nodes', (req: Request, res: Response) => {
  res.json({
    corridor: 'Pee Dub (PW) Temporal Corridor',
    totalNodes: peeDubNodes.length,
    temporalFramework: 'Dragon 9 (54-minute hour)',
    nodes: peeDubNodes,
  });
});

// Trigger Corridor Temporal Synchronization Pulse
app.post('/api/nodes/sync-pulse', (req: Request, res: Response) => {
  const clock = getDragon9TemporalClock();
  peeDubNodes = peeDubNodes.map((node) => ({
    ...node,
    status: 'synchronized',
    temporalDriftMs: +( (Math.random() - 0.5) * 0.08 ).toFixed(3), // snaps to sub-0.08ms drift
    latencyMs: Math.max(1.1, +(node.latencyMs * 0.85).toFixed(1)),
    lastPulseTime: new Date().toISOString(),
  }));

  res.json({
    success: true,
    message: 'Dragon 9 temporal synchronization pulse broadcast across the entire Pee Dub corridor.',
    synchronizedAt: new Date().toISOString(),
    d9Epoch: clock.temporalEpoch,
    harmonicResonance: clock.temporalResonance,
    nodes: peeDubNodes,
  });
});

// 4. Cross-Chain Bridge Gateway APIs
app.get('/api/bridge/state', (req: Request, res: Response) => {
  const vol = getLiveVolatilityIndex();
  res.json({
    guardians: SOVEREIGN_GUARDIANS,
    multiSigThreshold: '3-of-5',
    escrowVaultBalanceD9: supplyState.escrows.bridgeCollateralReserve.amount,
    supportedAssets: [
      { code: 'wD9-ETH', chain: 'Ethereum Mainnet', standard: 'ERC-20', bridgeSpeed: '~2.4 mins' },
      { code: 'wD9-SOL', chain: 'Solana SPL', standard: 'Token-2022', bridgeSpeed: '~12 secs' },
      { code: 'wD9-ATOM', chain: 'Cosmos Hub', standard: 'IBC Protocol', bridgeSpeed: '~45 secs' },
      { code: 'wD9-POL', chain: 'Polygon zkEVM', standard: 'ERC-20 zk', bridgeSpeed: '~1.8 mins' },
    ],
    volatilityDampener: vol,
    recentSwaps: bridgeSwaps,
  });
});

// Compute Bridge Quote with Sliding-Scale Volatility Fee Dampeners
app.post('/api/bridge/quote', (req: Request, res: Response) => {
  const { amountD9, targetAsset } = req.body;
  const numAmount = parseFloat(amountD9) || 0;

  if (numAmount <= 0) {
    return res.status(400).json({ error: 'Bridge amount must be greater than 0 D9.' });
  }

  const vol = getLiveVolatilityIndex();
  const rawFeeAmount = Math.round(numAmount * (vol.baseFee / 100));
  const sovereignSubsidy = Math.round(rawFeeAmount * (parseFloat(vol.dampingSubsidyRate.toString()) / 100) * 0.72);
  const netFeeD9 = Math.max(5, rawFeeAmount - sovereignSubsidy);
  const mintAmount = numAmount - netFeeD9;

  // HTLC parameters
  const preimageMock = '0xd9_' + crypto.randomBytes(16).toString('hex');
  const hashLock = '0x' + crypto.createHash('sha256').update(preimageMock).digest('hex');

  res.json({
    amountD9: numAmount,
    targetAsset: targetAsset || 'wD9-ETH',
    volatilityIndex: vol.index,
    volatilityLevel: vol.level,
    baseFeePercent: vol.baseFee,
    dampenedFeePercent: vol.dampenedFee,
    sovereignSubsidyAmount: sovereignSubsidy,
    netFeeD9,
    mintAmount,
    hashLock,
    timelockMinutes: 54, // 1 Dragon 9 hour
    multiSigThreshold: '3-of-5 Sovereign Escrow Guardians',
  });
});

// Execute Interactive HTLC Atomic Swap Simulation
app.post('/api/bridge/execute-swap', (req: Request, res: Response) => {
  const { amountD9, targetAsset, recipientAddress } = req.body;
  const numAmount = parseFloat(amountD9) || 50000;

  if (numAmount <= 0) {
    return res.status(400).json({ error: 'Bridge amount must be greater than 0 D9.' });
  }

  const vol = getLiveVolatilityIndex();
  const rawFeeAmount = Math.round(numAmount * (vol.baseFee / 100));
  const sovereignSubsidy = Math.round(rawFeeAmount * (parseFloat(vol.dampingSubsidyRate.toString()) / 100) * 0.72);
  const netFeeD9 = Math.max(5, rawFeeAmount - sovereignSubsidy);
  const mintAmount = numAmount - netFeeD9;

  // Real SHA-256 Preimage and HashLock
  const secretPreimage = '0xd9_atomic_' + crypto.randomBytes(16).toString('hex');
  const hashLock = '0x' + crypto.createHash('sha256').update(secretPreimage).digest('hex');

  const newSwap: HTLCSwap = {
    id: `SWAP-D9-${Math.floor(1000 + Math.random() * 9000)}`,
    sourceAsset: 'D9-NATIVE',
    targetAsset: targetAsset || 'wD9-ETH',
    amountD9: numAmount,
    wrappedMintAmount: mintAmount,
    recipientAddress: recipientAddress || `0x${crypto.randomBytes(18).toString('hex')}`,
    hashLock,
    secretPreimage, // Available for claim
    timelockMinutes: 54,
    timelockExpiry: new Date(Date.now() + 54 * 60 * 1000).toISOString(),
    multiSigGuardiansSigned: 4,
    requiredGuardians: 3,
    volatilityIndex: vol.index,
    baseFeePercent: vol.baseFee,
    dampenedFeePercent: vol.dampenedFee,
    sovereignSubsidyAmount: sovereignSubsidy,
    netFeeD9,
    status: 'MINTED_COMPLETED',
    createdAt: new Date().toISOString(),
    txHash: '0x' + crypto.randomBytes(32).toString('hex'),
  };

  // Add to top of list
  bridgeSwaps.unshift(newSwap);
  if (bridgeSwaps.length > 25) bridgeSwaps.pop();

  // Adjust escrow locked balance slightly to reflect simulation reality
  supplyState.escrows.bridgeCollateralReserve.amount += numAmount;

  res.json({
    success: true,
    message: 'Cross-chain HTLC atomic swap executed into 3-of-5 Multi-Sig Escrow.',
    swap: newSwap,
  });
});

// Claim / Reveal Preimage API
app.post('/api/bridge/reveal-preimage', (req: Request, res: Response) => {
  const { swapId } = req.body;
  const swap = bridgeSwaps.find((s) => s.id === swapId);
  if (!swap) {
    return res.status(404).json({ error: 'Swap not found.' });
  }

  res.json({
    swapId: swap.id,
    hashLock: swap.hashLock,
    secretPreimage: swap.secretPreimage,
    verified: true,
    algorithm: 'SHA-256 HTLC Timelock Standard',
  });
});

// Vite middleware / production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Deniro 9 Server operational on port ${PORT}`);
  });
}

startServer();
