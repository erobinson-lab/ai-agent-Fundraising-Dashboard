export type VentureId = "nilvault" | "dentalpass" | "midwestbudz";

export interface QAEntry {
  keywords: string[];
  question: string;
  answer: string;
}

export interface FinancialLine {
  label: string;
  value: string;
}

export interface VentureProfile {
  id: VentureId;
  name: string;
  tagline: string;
  sector: string;
  stage: string;
  ask: string;
  useOfFunds: string;
  slideCount: number;
  colorFrom: string;
  colorTo: string;
  accent: string;
  keyStats: FinancialLine[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  qaLibrary: QAEntry[];
  complianceNote: string;
  eligibleStates?: string[];
}

export interface EngagementEvent {
  ventureId: VentureId;
  investorId: string;
  investorName: string;
  slideIndex: number;
  dwellMs: number;
  timestamp: number;
}

export interface ChatTurn {
  role: "investor" | "agent";
  text: string;
  timestamp: number;
  escalated?: boolean;
}

export type VerificationProvider = "self_attested" | "parallel_markets";
export type VerificationStatus = "unverified" | "pending" | "verified" | "failed" | "expired";

export interface AccreditationVerification {
  provider: VerificationProvider;
  status: VerificationStatus;
  verifiedAt?: number;
  expiresAt?: number;
  parallelEntityId?: string;
}

export interface InvestorSession {
  id: string;
  ventureId: VentureId;
  investorName: string;
  firm: string;
  accredited: boolean;
  verification: AccreditationVerification;
  createdAt: number;
  transcript: ChatTurn[];
}
