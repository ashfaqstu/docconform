import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, FileText, CheckCircle, Download } from 'lucide-react';
import { generateMockReview } from '../services/mockData';
import { Review, ReviewStatus } from '../types';
import { Button } from '../components/ui/Button';
import { TermsView } from './dashboard/TermsView';
import { IssuesView } from './dashboard/IssuesView';
import { ExportView } from './dashboard/ExportView';
import clsx from 'clsx';

export const ReviewDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [review, setReview] = useState<Review | null>(null);
  const [activeTab, setActiveTab] = useState<'terms' | 'issues' | 'export'>('terms');

  // Load data (simulate fetching existing review)
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const state = location.state as { executedName: string; termSheetName?: string } | undefined;
      const data = generateMockReview(id, state?.executedName || 'Executed.pdf', state?.termSheetName);
      setReview(data);
    }
  }, [id, location.state]);

  if (!review) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 mb-4 animate-spin text-primary2" />
        <p>Retrieving extraction results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{review.borrowerName}</h1>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs border border-success/20">
              Extraction Complete
            </span>
          </div>
          <p className="text-subtext text-sm">
            Facility: {review.facilityName} • ID: <span className="font-mono text-gray-400">{review.id.split('-')[0]}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right mr-4 hidden md:block">
            <div className="text-xs text-subtext">Executed Agreement</div>
            <div className="text-sm text-gray-300 font-medium truncate max-w-[150px]">{review.executedFileName}</div>
          </div>
          {review.termSheetFileName && (
            <div className="text-right mr-4 hidden md:block border-l border-white/10 pl-4">
              <div className="text-xs text-subtext">Term Sheet</div>
              <div className="text-sm text-gray-300 font-medium truncate max-w-[150px]">{review.termSheetFileName}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <TabButton 
            active={activeTab === 'terms'} 
            onClick={() => setActiveTab('terms')} 
            icon={<FileText size={18} />}
            label="Extracted Terms"
            count={review.terms.length}
          />
          <TabButton 
            active={activeTab === 'issues'} 
            onClick={() => setActiveTab('issues')} 
            icon={<AlertCircle size={18} />}
            label="Issues & Findings"
            count={review.issues.length}
            hasAlert={review.issues.some(i => i.severity === 'HIGH')}
          />
          <TabButton 
            active={activeTab === 'export'} 
            onClick={() => setActiveTab('export')} 
            icon={<Download size={18} />}
            label="Export & Audit"
          />
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'terms' && <TermsView review={review} />}
        {activeTab === 'issues' && <IssuesView review={review} />}
        {activeTab === 'export' && <ExportView review={review} />}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string; 
  count?: number;
  hasAlert?: boolean;
}> = ({ active, onClick, icon, label, count, hasAlert }) => (
  <button
    onClick={onClick}
    className={clsx(
      active
        ? 'border-primary2 text-primary2'
        : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300',
      'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors'
    )}
  >
    <span className={clsx("mr-2", active ? "text-primary2" : "text-gray-500 group-hover:text-gray-300")}>
      {icon}
    </span>
    {label}
    {count !== undefined && (
      <span className={clsx(
        "ml-2 py-0.5 px-2 rounded-full text-xs",
        active ? "bg-primary2/10 text-primary2" : "bg-white/5 text-gray-400",
        hasAlert && !active && "bg-red-500/10 text-red-400 border border-red-500/20"
      )}>
        {count}
      </span>
    )}
  </button>
);