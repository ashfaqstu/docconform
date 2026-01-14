import React from 'react';
import { Review } from '../../types';
import { Button } from '../../components/ui/Button';
import { FileDown, Shield, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ExportView: React.FC<{ review: Review }> = ({ review }) => {
  const chartData = [
    { name: 'Terms Extracted', value: review.terms.length, color: '#2563EB' },
    { name: 'Matches', value: review.terms.filter(t => t.isMatch !== false).length, color: '#10B981' },
    { name: 'Issues', value: review.issues.length, color: review.issues.length > 0 ? '#EF4444' : '#E6EAF0' },
  ];

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(review, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `review-${review.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col: Actions & Chart */}
      <div className="space-y-8">
        <div className="bg-surface rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Export Report</h3>
          <p className="text-sm text-gray-400 mb-6">
            Generate a regulator-ready package including the structured JSON data, a CSV summary of all terms, and the immutable audit log.
          </p>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="secondary" leftIcon={<FileDown size={18} />} onClick={downloadJSON}>
              Download JSON Package
            </Button>
            <Button className="w-full justify-start" variant="secondary" leftIcon={<FileDown size={18} />}>
              Download CSV Summary
            </Button>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-white/5 p-6 h-80">
           <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase">Extraction Summary</h3>
           <ResponsiveContainer width="100%" height="90%">
             <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
               <XAxis type="number" hide />
               <YAxis dataKey="name" type="category" width={100} tick={{fill: '#9CA3AF', fontSize: 12}} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#0B1220', borderColor: '#374151', color: '#fff' }}
                 itemStyle={{ color: '#fff' }}
                 cursor={{fill: 'rgba(255,255,255,0.05)'}}
               />
               <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
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