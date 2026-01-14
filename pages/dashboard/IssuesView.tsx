import React from 'react';
import { Review, IssueSeverity, IssueCode } from '../../types';
import { SeverityBadge, Badge } from '../../components/ui/Badge';
import { AlertTriangle, AlertOctagon, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export const IssuesView: React.FC<{ review: Review }> = ({ review }) => {
  if (review.issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-lg border border-white/5 border-dashed">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="text-white font-medium text-lg">No Issues Detected</h3>
        <p className="text-gray-400 text-sm mt-2 max-w-sm text-center">
          The executed agreement appears to fully comply with the term sheet and standard regulatory clauses.
        </p>
      </div>
    );
  }

  const getIssueCodeLabel = (code: IssueCode) => {
    switch (code) {
      case IssueCode.MISMATCH: return 'Value Mismatch';
      case IssueCode.MISSING_CLAUSE: return 'Missing Clause';
      case IssueCode.CLAUSE_PRESENT: return 'Clause Present';
      case IssueCode.COMPLETENESS: return 'Completeness Check';
      case IssueCode.MULTIPLE_VALUES: return 'Multiple Values';
      case IssueCode.CONSISTENCY_FAIL: return 'Consistency Failure';
      default: return code;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Summary Header */}
      <div className="bg-surface rounded-lg border border-white/5 p-4 flex gap-6 text-sm mb-6">
        <span className="text-gray-400">
          <span className="text-red-500 font-medium">{review.issues.filter(i => i.severity === IssueSeverity.HIGH).length}</span> Critical
        </span>
        <span className="text-gray-400">
          <span className="text-orange-500 font-medium">{review.issues.filter(i => i.severity === IssueSeverity.WARN).length}</span> Warnings
        </span>
        <span className="text-gray-400">
          <span className="text-blue-500 font-medium">{review.issues.filter(i => i.severity === IssueSeverity.INFO).length}</span> Informational
        </span>
      </div>

      {review.issues.map((issue) => (
        <div 
          key={issue.id} 
          className={clsx(
            "rounded-lg border p-6 transition-all hover:shadow-lg",
            issue.severity === IssueSeverity.HIGH 
              ? "bg-red-950/10 border-red-500/20 hover:border-red-500/40" 
              : issue.severity === IssueSeverity.WARN
                ? "bg-orange-950/10 border-orange-500/20 hover:border-orange-500/40"
                : "bg-surface border-white/10 hover:border-white/20"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={clsx(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              issue.severity === IssueSeverity.HIGH ? "bg-red-500/10 text-red-400" : 
              issue.severity === IssueSeverity.WARN ? "bg-orange-500/10 text-orange-400" : 
              "bg-blue-500/10 text-blue-400"
            )}>
              {issue.severity === IssueSeverity.HIGH && <AlertOctagon size={20} />}
              {issue.severity === IssueSeverity.WARN && <AlertTriangle size={20} />}
              {issue.severity === IssueSeverity.INFO && <HelpCircle size={20} />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-base font-semibold text-white">{issue.message}</h4>
                  {issue.relatedTermLabel && (
                    <p className="text-xs text-gray-500 mt-1">Related Term: <span className="text-gray-400">{issue.relatedTermLabel}</span></p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{getIssueCodeLabel(issue.code)}</Badge>
                  <SeverityBadge severity={issue.severity} />
                </div>
              </div>

              {/* Side-by-side Evidence for Mismatch issues */}
              {(issue.approvedEvidence || issue.executedEvidence) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-bg rounded p-3 border border-primary2/20">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-primary2" />
                      <p className="text-xs font-semibold text-primary2 uppercase tracking-wide">Approved (Term Sheet)</p>
                    </div>
                    <p className="text-sm text-gray-300 font-mono">{issue.approvedEvidence || 'N/A'}</p>
                  </div>
                  <div className="bg-bg rounded p-3 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-gray-400" />
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Executed (Agreement)</p>
                    </div>
                    <p className="text-sm text-gray-300 font-mono">{issue.executedEvidence || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* Standard Evidence display */}
              {!issue.approvedEvidence && !issue.executedEvidence && issue.evidence && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Evidence & Context</p>
                  <div className="bg-bg rounded p-3 text-sm text-gray-300 font-mono border border-white/5">
                    {issue.evidence}
                  </div>
                </div>
              )}

              {/* Regulatory Impact */}
              {issue.regulationImpact && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Regulatory Impact</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {issue.regulationImpact}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                 <button className="text-xs font-medium text-primary2 hover:text-white transition-colors">Mark as Resolved</button>
                 <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Add Comment</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};