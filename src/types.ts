export interface TemporalClock {
  isoTime: string;
  d9Hour: number;
  d9Minute: number;
  d9Second: number;
  hourProgress: number;
  currentOctave: number;
  totalOctaves: number;
  octaveProgress: number;
  harmonicFrequency: number;
  temporalResonance: number;
  secondsUntilNextD9Hour: number;
  temporalEpoch: number;
  tickRate: string;
}

export interface EscrowItem {
  amount: number;
  percentage: number;
  locked: boolean;
  guardianCount: string;
}

export interface SupplyState {
  population: number;
  perCapitaRate: number;
  supplyCeiling: number;
  circulatingSupply: number;
  escrows: {
    sovereignTreasury: EscrowItem;
    directCitizenAllotment: EscrowItem;
    liquidCorridorCirculation: EscrowItem;
    bridgeCollateralReserve: EscrowItem;
    heritageStakingPool: EscrowItem;
  };
  totalEscrowLockedD9: number;
  circulatingRatioPercent: number;
  escrowLockedRatioPercent: number;
  notesPerCapitaMax: number;
  lastCensusSync: string;
  sovereignValidationHash: string;
}

export interface PeeDubNode {
  id: string;
  name: string;
  location: string;
  corridorKm: number;
  role: 'Consensus Master' | 'Corridor Mesh' | 'Sonic Repeater' | 'Liquidity Sentinel' | 'State Verifier' | 'Inland Nexus';
  status: 'synchronized' | 'harmonizing' | 'pulse-broadcasting';
  latencyMs: number;
  temporalDriftMs: number;
  blockHeight: number;
  harmonicWeight: number;
  peersConnected: number;
  lastPulseTime: string;
}

export interface SovereignGuardian {
  id: string;
  name: string;
  status: string;
  weight: number;
}

export interface VolatilityEngine {
  index: number;
  level: 'CALM' | 'ELEVATED' | 'SPIKE' | 'SEVERE';
  dampingSubsidyRate: number;
  baseFee: number;
  dampenedFee: number;
}

export interface HTLCSwap {
  id: string;
  sourceAsset: 'D9-NATIVE';
  targetAsset: 'wD9-ETH' | 'wD9-SOL' | 'wD9-ATOM' | 'wD9-POL';
  amountD9: number;
  wrappedMintAmount: number;
  recipientAddress: string;
  hashLock: string;
  secretPreimage?: string;
  timelockMinutes: number;
  timelockExpiry: string;
  multiSigGuardiansSigned: number;
  requiredGuardians: number;
  volatilityIndex: number;
  baseFeePercent: number;
  dampenedFeePercent: number;
  sovereignSubsidyAmount: number;
  netFeeD9: number;
  status: 'PENDING_ESCROW' | 'ESCROW_LOCKED' | 'PREIMAGE_SUBMITTED' | 'MINTED_COMPLETED' | 'REFUNDED';
  createdAt: string;
  txHash: string;
}

export interface BridgeQuote {
  amountD9: number;
  targetAsset: string;
  volatilityIndex: number;
  volatilityLevel: string;
  baseFeePercent: number;
  dampenedFeePercent: number;
  sovereignSubsidyAmount: number;
  netFeeD9: number;
  mintAmount: number;
  hashLock: string;
  timelockMinutes: number;
  multiSigThreshold: string;
}
