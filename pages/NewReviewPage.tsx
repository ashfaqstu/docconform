import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { simulateExtraction } from '../services/mockData';
import clsx from 'clsx';

export const NewReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [executedFile, setExecutedFile] = useState<File | null>(null);
  const [termSheetFile, setTermSheetFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'executed' | 'terms') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'executed') setExecutedFile(e.target.files[0]);
      else setTermSheetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!executedFile) return;

    setIsProcessing(true);
    // Simulate backend processing
    try {
      const reviewId = crypto.randomUUID();
      await simulateExtraction(reviewId, executedFile.name, termSheetFile?.name);
      // Pass the mock data via state or just the ID if we had real backend
      navigate(`/reviews/${reviewId}`, { state: { executedName: executedFile.name, termSheetName: termSheetFile?.name } });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Create New Compliance Review</h1>
        <p className="text-subtext">Upload the executed agreement. Optionally upload the approved term sheet for mismatch detection.</p>
      </div>

      <div className="space-y-8">
        {/* Upload Card 1: Executed (Required) */}
        <div className="bg-surface border border-white/5 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary2 text-xs">1</span>
              Executed Agreement
            </h3>
            <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded">Required</span>
          </div>
          
          <UploadZone 
            file={executedFile} 
            onChange={(e) => handleFileChange(e, 'executed')} 
            id="executed-upload"
          />
        </div>

        {/* Upload Card 2: Term Sheet (Optional) */}
        <div className="bg-surface border border-white/5 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs">2</span>
              Approved Term Sheet
            </h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-400/10 px-2 py-1 rounded">Optional</span>
          </div>

          <UploadZone 
            file={termSheetFile} 
            onChange={(e) => handleFileChange(e, 'terms')} 
            id="terms-upload"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end pt-4 gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
          <Button 
            size="lg" 
            disabled={!executedFile} 
            isLoading={isProcessing}
            onClick={handleSubmit}
          >
            {isProcessing ? 'Extracting & Validating...' : 'Start Review'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const UploadZone: React.FC<{ file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; id: string }> = ({ file, onChange, id }) => {
  return (
    <div className="relative">
      {!file ? (
        <label htmlFor={id} className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/5 hover:border-primary2/50 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 mb-3 text-gray-500 group-hover:text-primary2 transition-colors" />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, DOCX (MAX. 50MB)</p>
          </div>
          <input id={id} type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={onChange} />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-bg rounded-lg border border-primary2/20">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary2/20 text-primary2 rounded flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={() => { 
            // Reset logic would go here, simplistic for demo
            const input = document.getElementById(id) as HTMLInputElement;
            if(input) input.value = '';
          }} className="text-gray-500 hover:text-white">
            <CheckCircle2 className="text-success" />
          </button>
        </div>
      )}
    </div>
  );
}