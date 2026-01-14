export enum ReviewStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED'
}

export enum SourceType {
  EXECUTED = 'EXECUTED',
  TERMSHEET = 'TERMSHEET',
  APPROVED = 'APPROVED'
}

export enum IssueSeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  HIGH = 'HIGH'
}

export enum IssueCode {
  MISMATCH = 'MISMATCH',
  MULTIPLE_VALUES = 'MULTIPLE_VALUES',
  MISSING_CLAUSE = 'MISSING_CLAUSE',
  CONSISTENCY_FAIL = 'CONSISTENCY_FAIL',
  CLAUSE_PRESENT = 'CLAUSE_PRESENT',
  COMPLETENESS = 'COMPLETENESS'
}

export interface ExtractedTerm {
  key: string;
  label: string;
  value: string;
  source: SourceType;
  confidence: number;
  evidenceText?: string;
  evidenceLocation?: string;
  isMatch?: boolean;
}

export interface Issue {
  id: string;
  severity: IssueSeverity;
  code: IssueCode;
  message: string;
  relatedTermLabel?: string;
  relatedTermKey?: string;
  evidence: string;
  regulationImpact: string;
  approvedEvidence?: string;
  executedEvidence?: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: 'UPLOAD' | 'EXTRACT' | 'EXPORT' | 'VALIDATE';
  timestamp: string;
  details: string;
  hash?: string;
}

export interface Review {
  id: string;
  status: ReviewStatus;
  borrowerName: string;
  facilityName: string;
  createdAt: string;
  executedFileName: string;
  termSheetFileName?: string;
  executedFileHash?: string;
  termSheetFileHash?: string;
  terms: ExtractedTerm[];
  issues: Issue[];
  auditLog: AuditEvent[];
}