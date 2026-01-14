import { AuditEvent, ExtractedTerm, Issue, IssueCode, IssueSeverity, Review, ReviewStatus, SourceType } from '../types';

const MOCK_DELAY = 2000;

export const generateMockReview = (id: string, executedFile: string, termSheetFile?: string): Review => {
  const now = new Date().toISOString();
  
  const terms: ExtractedTerm[] = [
    { key: 'borrower', label: 'Borrower', value: 'Acme Heavy Industries Ltd.', source: SourceType.EXECUTED, confidence: 0.98, isMatch: true, evidenceText: 'THIS AGREEMENT is made between Acme Heavy Industries Ltd. (the "Borrower")...' },
    { key: 'amount', label: 'Facility Amount', value: 'EUR 250,000,000', source: SourceType.EXECUTED, confidence: 0.95, isMatch: false, evidenceText: 'The Total Commitments are EUR 250,000,000.' },
    { key: 'maturity', label: 'Maturity Date', value: '31 December 2028', source: SourceType.EXECUTED, confidence: 0.99, isMatch: true, evidenceText: 'Termination Date means 31 December 2028.' },
    { key: 'margin', label: 'Margin', value: '3.50% p.a.', source: SourceType.EXECUTED, confidence: 0.92, isMatch: true, evidenceText: 'The Margin is 3.50 per cent per annum.' },
    { key: 'leverage', label: 'Total Net Leverage', value: '4.50:1', source: SourceType.EXECUTED, confidence: 0.88, isMatch: true, evidenceText: 'Total Net Leverage Ratio shall not exceed 4.50:1.' },
    { key: 'sanctions', label: 'Sanctions Clause', value: 'Present', source: SourceType.EXECUTED, confidence: 0.99, isMatch: true, evidenceText: '...compliance with all applicable Sanctions Laws...' },
    { key: 'bailin', label: 'Bail-In Clause', value: 'Missing', source: SourceType.EXECUTED, confidence: 0.99, isMatch: false, evidenceText: 'N/A' },
  ];

  // If a term sheet is provided, we simulate a mismatch in Facility Amount
  // Term sheet said 200M, Executed says 250M
  
  const issues: Issue[] = [
    {
      id: 'i1',
      severity: IssueSeverity.HIGH,
      code: IssueCode.MISMATCH,
      message: 'Facility Amount differs between Term Sheet and Executed Agreement',
      relatedTermLabel: 'Facility Amount',
      evidence: 'Term Sheet: EUR 200,000,000 vs Executed: EUR 250,000,000',
      regulationImpact: 'Material economic divergence requires credit committee re-approval.'
    },
    {
      id: 'i2',
      severity: IssueSeverity.WARN,
      code: IssueCode.MISSING_CLAUSE,
      message: 'Mandatory EEA Bail-In Clause is missing',
      evidence: 'Section 18 (General Undertakings) does not contain BRRD recognition language.',
      regulationImpact: 'Non-compliant with Article 55 of BRRD. unenforceable in resolution.'
    },
    {
      id: 'i3',
      severity: IssueSeverity.INFO,
      code: IssueCode.MULTIPLE_VALUES,
      message: 'Multiple Margin values detected',
      relatedTermLabel: 'Margin',
      evidence: 'Found "3.50%" and "Default Interest: 5.50%" nearby.',
      regulationImpact: 'Ensure operational systems capture the correct base margin.'
    }
  ];

  const auditLog: AuditEvent[] = [
    {
      id: 'a1',
      actor: 'System User',
      action: 'UPLOAD',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      details: `Uploaded ${executedFile} (Hash: e3b0c442...)`,
    },
    {
      id: 'a2',
      actor: 'DocConform Engine',
      action: 'EXTRACT',
      timestamp: now,
      details: 'Completed deterministic extraction of 45 key terms.',
    },
    {
      id: 'a3',
      actor: 'DocConform Engine',
      action: 'VALIDATE',
      timestamp: now,
      details: 'Cross-referenced against Term Sheet V2.pdf.',
    }
  ];

  return {
    id,
    status: ReviewStatus.COMPLETE,
    borrowerName: 'Acme Heavy Industries Ltd.',
    facilityName: 'Revolving Credit Facility',
    createdAt: now,
    executedFileName: executedFile,
    termSheetFileName: termSheetFile,
    terms,
    issues: termSheetFile ? issues : issues.filter(i => i.code !== IssueCode.MISMATCH), // Only show mismatch if TS provided
    auditLog
  };
};

export const simulateExtraction = async (id: string, executedFile: string, termSheetFile?: string): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockReview(id, executedFile, termSheetFile));
    }, MOCK_DELAY);
  });
};