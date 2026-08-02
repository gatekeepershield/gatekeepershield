export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScamIndicator {
  category: string;
  title: string;
  description: string;
  severity: RiskLevel;
  foundEvidence?: string;
}

export interface AuthenticityMarker {
  title: string;
  description: string;
}

export interface SafetyStep {
  step: string;
  details: string;
}

export interface CompanyVerification {
  isRegisteredCompany?: boolean | null;
  domainCheckNotes: string;
  officialWebsiteTip: string;
}

export interface JobAnalysisResult {
  id: string;
  timestamp: number;
  jobTitle: string;
  companyName: string;
  extractedText: string;
  overallRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  verdictSummary: string;
  aiScamIndicators: ScamIndicator[];
  authenticityMarkers: AuthenticityMarker[];
  scamTacticsDetected: string[];
  actionableSafetySteps: SafetyStep[];
  companyVerificationGuide: CompanyVerification;
  sourceType: 'image' | 'text' | 'sample';
  imagePreviewUrl?: string;
}

export interface SampleJob {
  id: string;
  title: string;
  badge: string;
  riskLevel: RiskLevel;
  description: string;
  fullText: string;
  mockImageUrl?: string;
  analysis: JobAnalysisResult;
}
