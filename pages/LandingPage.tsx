import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, AlertTriangle, FileCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary2 to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:flex-row lg:items-center lg:gap-x-10 lg:px-8 lg:py-24 min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-0">
            <span className="inline-flex items-center space-x-2 rounded-full bg-primary2/10 px-3 py-1 text-sm font-medium text-primary2 ring-1 ring-inset ring-primary2/20 mb-6">
              <span>Aligned with supervisory review practices</span>
            </span>
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Verification of Executed Loan Agreements
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            DocConform reconstructs the legally binding economic terms regulators already examine, verifies them against approved credit conditions, and records evidence of any divergence.
          </p>
          <p className="mt-4 text-sm leading-6 text-subtext border-l-2 border-white/10 pl-4 italic">
            Supervisors receive executed agreements as static PDFs; DocConform turns them into verifiable, review-ready records.
          </p>
          <div className="mt-10">
            <Button size="lg" onClick={() => navigate('/reviews/new')} rightIcon={<ArrowRight size={16} />}>
              Start a Review
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-1">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
                <FeatureCard 
                  icon={<FileSearch className="text-accent" />}
                  title="Extraction"
                  desc="Deterministic regex-based parsing for 100% auditability. No hallucinations."
                />
                <FeatureCard 
                  icon={<AlertTriangle className="text-warn" />}
                  title="Mismatch Detection"
                  desc="Instantly flag differences between Term Sheets and Executed Agreements."
                />
                <FeatureCard 
                  icon={<FileCheck className="text-primary2" />}
                  title="Compliance Clauses"
                  desc="Verify presence of mandatory Bail-In and Sanctions language."
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-x-4 rounded-xl bg-surface/50 p-6 ring-1 ring-inset ring-white/10 hover:bg-surface transition-colors">
    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-bg ring-1 ring-white/10">
      {icon}
    </div>
    <div className="text-base leading-7">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-gray-400 text-sm">{desc}</p>
    </div>
  </div>
);