import React, { useState } from 'react';
import { Review, SourceType } from '../../types';
import { Button } from '../../components/ui/Button';
import { FileDown, Shield, Clock, Loader2, Hash, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiService, API_BASE_URL } from '../../services/api';

export const ExportView: React.FC<{ review: Review }> = ({ review }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv' | null>(null);

  // Calculate matches from side-by-side comparison
  const approvedTerms = review.terms.filter(t => t.source === SourceType.APPROVED);
  const executedTerms = review.terms.filter(t => t.source === SourceType.EXECUTED);
  const matchCount = executedTerms.filter(t => t.isMatch !== false).length;
  const mismatchCount = executedTerms.filter(t => t.isMatch === false).length;

  const chartData = [
    { name: 'Approved Terms', value: approvedTerms.length, color: '#2563EB' },
    { name: 'Executed Terms', value: executedTerms.length, color: '#6366F1' },
    { name: 'Matches', value: matchCount, color: '#10B981' },
    { name: 'Mismatches', value: mismatchCount, color: mismatchCount > 0 ? '#EF4444' : '#E6EAF0' },
    { name: 'Issues', value: review.issues.length, color: review.issues.length > 0 ? '#F59E0B' : '#E6EAF0' },
  ];

  const downloadPDF = async () => {
    setIsExporting(true);
    setExportFormat('pdf');
    try {
      // Use GET endpoint for PDF export
      window.open(`${API_BASE_URL}/reviews/${review.id}/export-pdf/`, '_blank');
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const downloadJSON = async () => {
    setIsExporting(true);
    setExportFormat('json');
    try {
      window.open(`${API_BASE_URL}/reviews/${review.id}/export-json/`, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const downloadCSV = async () => {
    setIsExporting(true);
    setExportFormat('csv');
    try {
      window.open(`${API_BASE_URL}/reviews/${review.id}/export-csv/`, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col: Actions & Chart */}
      <div className="space-y-8">
        {/* File Hashes */}
        {(review.executedFileHash || review.termSheetFileHash) && (
          <div className="bg-surface rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash size={16} className="text-primary2" />
              <h3 className="text-sm font-medium text-gray-400 uppercase">File Integrity</h3>
            </div>
            <div className="space-y-3">
              {review.executedFileHash && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Executed Agreement (SHA-256)</p>
                  <code className="text-xs text-gray-300 font-mono bg-bg px-2 py-1 rounded block truncate">
                    {review.executedFileHash}
                  </code>
                </div>
              )}
              {review.termSheetFileHash && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Term Sheet (SHA-256)</p>
                  <code className="text-xs text-gray-300 font-mono bg-bg px-2 py-1 rounded block truncate">
                    {review.termSheetFileHash}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-surface rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Export Report</h3>
          <p className="text-sm text-gray-400 mb-6">
            Generate a regulator-ready PDF report with executive summary, terms comparison, issues analysis, and audit trail.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="primary" 
              leftIcon={isExporting && exportFormat === 'pdf' ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />} 
              onClick={downloadPDF} 
              disabled={isExporting}
            >
              {isExporting && exportFormat === 'pdf' ? 'Generating PDF...' : 'Download PDF Report'}
            </Button>
            <div className="border-t border-white/5 pt-3 mt-3">
              <p className="text-xs text-gray-500 mb-2">Additional formats:</p>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 justify-center text-sm" 
                  variant="secondary" 
                  leftIcon={<FileDown size={16} />} 
                  onClick={downloadJSON} 
                  disabled={isExporting}
                >
                  JSON
                </Button>
                <Button 
                  className="flex-1 justify-center text-sm" 
                  variant="secondary" 
                  leftIcon={<FileDown size={16} />} 
                  onClick={downloadCSV}
                  disabled={isExporting}
                >
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-white/5 p-6 h-96">
           <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase">Extraction Summary</h3>
           <ResponsiveContainer width="100%" height="90%">
             <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
               <XAxis type="number" hide />
               <YAxis dataKey="name" type="category" width={100} tick={{fill: '#9CA3AF', fontSize: 11}} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#0B1220', borderColor: '#374151', color: '#fff' }}
                 itemStyle={{ color: '#fff' }}
                 cursor={{fill: 'rgba(255,255,255,0.05)'}}
               />
               <Bar dataKey="value" barSize={18} radius={[0, 4, 4, 0]}>
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Right Col: Audit Log */}
      <div className="lg:col-span-2 bg-surface rounded-xl border border-white/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded bg-primary2/20 text-primary2 flex items-center justify-center">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Immutable Audit Log</h3>
            <p className="text-xs text-gray-400">SHA-256 verifiable timeline of all actions</p>
          </div>
        </div>

        <div className="relative border-l border-white/10 ml-4 space-y-8 py-2">
          {review.auditLog.map((event, idx) => (
            <div key={event.id} className="relative pl-8">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary2 ring-4 ring-bg" />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span className="text-sm font-medium text-white">{event.action}</span>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                   <Clock size={10} />
                   {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{event.details}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5">
                  Actor: {event.actor}
                </span>
                {event.hash && (
                  <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5 font-mono truncate max-w-[200px]">
                    Hash: {event.hash}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {/* Future/End state */}
          <div className="relative pl-8 opacity-50">
             <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-600 ring-4 ring-bg" />
             <p className="text-sm text-gray-500">Review archived</p>
          </div>
        </div>
      </div>
    </div>
  );
};