import React, { useState } from 'react';
import { Review, ExtractedTerm } from '../../types';
import { Search, Eye } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import clsx from 'clsx';

export const TermsView: React.FC<{ review: Review }> = ({ review }) => {
  const [selectedTerm, setSelectedTerm] = useState<ExtractedTerm | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table Section */}
      <div className="lg:col-span-2 bg-surface rounded-lg border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-medium">Digital Term Sheet</h3>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Filter terms..." 
               className="bg-bg border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-primary2 focus:ring-1 focus:ring-primary2 w-48"
             />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-bg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Field</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Extracted Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {review.terms.map((term, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedTerm(term)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{term.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">{term.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                       <div className={clsx("w-2 h-2 rounded-full", term.confidence > 0.9 ? "bg-success" : "bg-warn")} />
                       <span className="text-xs text-gray-500">{(term.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary2 hover:text-blue-400 flex items-center gap-1 text-xs">
                       <Eye size={14} /> Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Viewer Section */}
      <div className="bg-surface rounded-lg border border-white/5 p-6 h-fit sticky top-24">
        <h3 className="text-sm font-medium text-gray-400 uppercase mb-4 tracking-wider">Evidence Viewer</h3>
        {selectedTerm ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="mb-4">
               <label className="text-xs text-subtext block mb-1">Field</label>
               <p className="text-lg font-bold text-white">{selectedTerm.label}</p>
             </div>
             
             <div className="p-4 bg-bg rounded border border-primary2/20 relative">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary2 rounded-l"></div>
               <p className="font-mono text-sm text-gray-300 leading-relaxed">
                 "...{selectedTerm.evidenceText}..."
               </p>
               <div className="mt-3 flex justify-between items-center border-t border-white/5 pt-2">
                 <span className="text-xs text-gray-500">Source: Page 4, Section 2.1</span>
                 <Badge variant="info">Automated Extraction</Badge>
               </div>
             </div>

             <div className="mt-6 space-y-3">
               <h4 className="text-sm font-medium text-white">Validation Rules</h4>
               <div className="flex items-start gap-2 text-sm text-gray-400">
                 <div className="w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center mt-0.5 text-[10px]">✓</div>
                 <p>Format matches standard (ISO 8601 or Currency)</p>
               </div>
               <div className="flex items-start gap-2 text-sm text-gray-400">
                 <div className={clsx("w-4 h-4 rounded-full flex items-center justify-center mt-0.5 text-[10px]", selectedTerm.isMatch ? "bg-success/20 text-success" : "bg-red-500/20 text-red-500")}>
                    {selectedTerm.isMatch !== false ? '✓' : '!'}
                 </div>
                 <p>Matches Term Sheet value</p>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-sm">
            <Eye size={24} className="mb-2 opacity-50" />
            Select a row to verify evidence
          </div>
        )}
      </div>
    </div>
  );
};