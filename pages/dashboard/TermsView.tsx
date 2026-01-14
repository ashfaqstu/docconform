import React, { useState, useMemo } from 'react';
import { Review, ExtractedTerm, SourceType } from '../../types';
import { Search, Eye, Check, X, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import clsx from 'clsx';

interface TermComparison {
  key: string;
  label: string;
  approvedValue?: string;
  executedValue?: string;
  approvedTerm?: ExtractedTerm;
  executedTerm?: ExtractedTerm;
  status: 'MATCH' | 'MISMATCH' | 'APPROVED_ONLY' | 'EXECUTED_ONLY';
}

export const TermsView: React.FC<{ review: Review }> = ({ review }) => {
  const [selectedComparison, setSelectedComparison] = useState<TermComparison | null>(null);
  const [filter, setFilter] = useState('');

  // Build side-by-side comparison from terms
  const comparisons = useMemo(() => {
    const approved = new Map<string, ExtractedTerm>();
    const executed = new Map<string, ExtractedTerm>();
    
    review.terms.forEach(term => {
      if (term.source === SourceType.APPROVED) {
        approved.set(term.key, term);
      } else if (term.source === SourceType.EXECUTED) {
        executed.set(term.key, term);
      }
    });

    const allKeys = new Set([...approved.keys(), ...executed.keys()]);
    const result: TermComparison[] = [];

    allKeys.forEach(key => {
      const approvedTerm = approved.get(key);
      const executedTerm = executed.get(key);
      
      let status: TermComparison['status'] = 'EXECUTED_ONLY';
      if (approvedTerm && executedTerm) {
        status = approvedTerm.value === executedTerm.value ? 'MATCH' : 'MISMATCH';
      } else if (approvedTerm && !executedTerm) {
        status = 'APPROVED_ONLY';
      }

      result.push({
        key,
        label: executedTerm?.label || approvedTerm?.label || key,
        approvedValue: approvedTerm?.value,
        executedValue: executedTerm?.value,
        approvedTerm,
        executedTerm,
        status
      });
    });

    return result.sort((a, b) => {
      // Sort mismatches first, then matches
      const priority = { MISMATCH: 0, APPROVED_ONLY: 1, EXECUTED_ONLY: 2, MATCH: 3 };
      return priority[a.status] - priority[b.status];
    });
  }, [review.terms]);

  const filteredComparisons = comparisons.filter(c => 
    c.label.toLowerCase().includes(filter.toLowerCase()) ||
    c.approvedValue?.toLowerCase().includes(filter.toLowerCase()) ||
    c.executedValue?.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusBadge = (status: TermComparison['status']) => {
    switch (status) {
      case 'MATCH':
        return <Badge variant="success"><Check size={12} className="mr-1" />Match</Badge>;
      case 'MISMATCH':
        return <Badge variant="high"><X size={12} className="mr-1" />Mismatch</Badge>;
      case 'APPROVED_ONLY':
        return <Badge variant="warn"><AlertTriangle size={12} className="mr-1" />Missing</Badge>;
      case 'EXECUTED_ONLY':
        return <Badge variant="info">Executed Only</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table Section */}
      <div className="lg:col-span-2 bg-surface rounded-lg border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Terms Comparison</h3>
            <p className="text-xs text-gray-500 mt-1">Approved (Term Sheet) vs Executed (Agreement)</p>
          </div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Filter terms..." 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="bg-bg border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-primary2 focus:ring-1 focus:ring-primary2 w-48"
             />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-bg">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Field</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary2 uppercase tracking-wider">Approved</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Executed</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredComparisons.map((comparison) => (
                <tr 
                  key={comparison.key} 
                  className={clsx(
                    "hover:bg-white/5 transition-colors group cursor-pointer",
                    comparison.status === 'MISMATCH' && "bg-red-500/5"
                  )} 
                  onClick={() => setSelectedComparison(comparison)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">{comparison.label}</td>
                  <td className="px-4 py-3 text-sm text-primary2 font-mono max-w-[200px] truncate" title={comparison.approvedValue}>
                    {comparison.approvedValue || <span className="text-gray-600 italic">N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono max-w-[200px] truncate" title={comparison.executedValue}>
                    {comparison.executedValue || <span className="text-gray-600 italic">N/A</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {getStatusBadge(comparison.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary2 hover:text-blue-400 flex items-center gap-1 text-xs">
                       <Eye size={14} /> Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Footer */}
        <div className="p-4 border-t border-white/5 bg-bg flex gap-6 text-sm">
          <span className="text-gray-400">
            <span className="text-success font-medium">{comparisons.filter(c => c.status === 'MATCH').length}</span> Matches
          </span>
          <span className="text-gray-400">
            <span className="text-red-500 font-medium">{comparisons.filter(c => c.status === 'MISMATCH').length}</span> Mismatches
          </span>
          <span className="text-gray-400">
            <span className="text-warn font-medium">{comparisons.filter(c => c.status === 'APPROVED_ONLY').length}</span> Missing
          </span>
        </div>
      </div>

      {/* Evidence Viewer Section */}
      <div className="bg-surface rounded-lg border border-white/5 p-6 h-fit sticky top-24">
        <h3 className="text-sm font-medium text-gray-400 uppercase mb-4 tracking-wider">Evidence Viewer</h3>
        {selectedComparison ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
             <div>
               <label className="text-xs text-subtext block mb-1">Field</label>
               <p className="text-lg font-bold text-white">{selectedComparison.label}</p>
               {getStatusBadge(selectedComparison.status)}
             </div>
             
             {/* Approved Evidence */}
             {selectedComparison.approvedTerm && (
               <div className="p-4 bg-bg rounded border border-primary2/30 relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary2 rounded-l"></div>
                 <p className="text-xs text-primary2 font-medium mb-2">APPROVED (Term Sheet)</p>
                 <p className="font-mono text-sm text-white mb-2">{selectedComparison.approvedValue}</p>
                 <p className="font-mono text-xs text-gray-400 leading-relaxed">
                   "{selectedComparison.approvedTerm.evidenceText}"
                 </p>
                 {selectedComparison.approvedTerm.evidenceLocation && (
                   <span className="text-xs text-gray-500 mt-2 block">{selectedComparison.approvedTerm.evidenceLocation}</span>
                 )}
               </div>
             )}

             {/* Executed Evidence */}
             {selectedComparison.executedTerm && (
               <div className={clsx(
                 "p-4 bg-bg rounded border relative",
                 selectedComparison.status === 'MISMATCH' ? "border-red-500/30" : "border-white/10"
               )}>
                 <div className={clsx(
                   "absolute top-0 left-0 w-1 h-full rounded-l",
                   selectedComparison.status === 'MISMATCH' ? "bg-red-500" : "bg-gray-500"
                 )}></div>
                 <p className="text-xs text-gray-400 font-medium mb-2">EXECUTED (Agreement)</p>
                 <p className="font-mono text-sm text-white mb-2">{selectedComparison.executedValue}</p>
                 <p className="font-mono text-xs text-gray-400 leading-relaxed">
                   "{selectedComparison.executedTerm.evidenceText}"
                 </p>
                 {selectedComparison.executedTerm.evidenceLocation && (
                   <span className="text-xs text-gray-500 mt-2 block">{selectedComparison.executedTerm.evidenceLocation}</span>
                 )}
               </div>
             )}

             {/* Confidence */}
             <div className="flex items-center gap-2 text-sm text-gray-400 pt-2">
               <div className={clsx(
                 "w-2 h-2 rounded-full",
                 (selectedComparison.executedTerm?.confidence || 0) > 0.9 ? "bg-success" : "bg-warn"
               )} />
               <span>Confidence: {((selectedComparison.executedTerm?.confidence || selectedComparison.approvedTerm?.confidence || 0) * 100).toFixed(0)}%</span>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-sm">
            <Eye size={24} className="mb-2 opacity-50" />
            Select a row to compare evidence
          </div>
        )}
      </div>
    </div>
  );
};