import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export const FileUploader = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [contractName, setContractName] = useState('');
  const [stage, setStage] = useState('IDLE'); // IDLE, UPLOADED, EXTRACTING, ANALYZING, RISK_ANALYSIS, COMPLETED, ERROR
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setError('');
    
    // Simulate real-time visual pipeline progress
    setStage('UPLOADED');
    
    const formData = new FormData();
    formData.append('file', file);
    if (contractName) formData.append('contract_name', contractName);

    try {
      setTimeout(() => setStage('EXTRACTING'), 400);
      setTimeout(() => setStage('ANALYZING'), 1100);
      setTimeout(() => setStage('RISK_ANALYSIS'), 1800);

      const res = await api.post('/contracts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStage('COMPLETED');
      if (onUploadSuccess) {
        onUploadSuccess(res.data);
      }
    } catch (err) {
      setStage('ERROR');
      setError(err.response?.data?.detail || 'Contract upload and analysis failed.');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-base font-bold text-white mb-2">Upload Contract Document</h3>
      <p className="text-xs text-slate-400 mb-4">
        Supports PDF, DOCX, and TXT (up to 25MB). ContractIQ automatically extracts terms, classifies clauses, and assesses risk.
      </p>

      {stage === 'IDLE' && (
        <>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-10 h-10 text-blue-400 mb-3 animate-bounce" />
              <span className="text-sm font-medium text-slate-200">
                {file ? file.name : 'Drag & Drop your contract here or Click to Browse'}
              </span>
              <span className="text-xs text-slate-500 mt-1">PDF, DOCX, or TXT</span>
            </label>
          </div>

          {file && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-slate-400 hover:text-rose-400"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Custom Contract Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Services Agreement v2"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleUpload}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all"
              >
                Start Contract Intelligence Analysis
              </button>
            </div>
          )}
        </>
      )}

      {/* Processing State Pipeline Visualizer */}
      {stage !== 'IDLE' && stage !== 'ERROR' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3">
            <span>Processing Pipeline Status</span>
            <span className="text-blue-400">{stage.replace('_', ' ')}</span>
          </div>

          <div className="space-y-3">
            {[
              { key: 'UPLOADED', label: '1. File Uploaded & Validated' },
              { key: 'EXTRACTING', label: '2. Text & Metadata Extraction' },
              { key: 'ANALYZING', label: '3. AI Clause Classification' },
              { key: 'RISK_ANALYSIS', label: '4. Deterministic Risk Engine Calculation' },
              { key: 'COMPLETED', label: '5. Complete & Ready' }
            ].map((step, idx) => {
              const stagesOrder = ['UPLOADED', 'EXTRACTING', 'ANALYZING', 'RISK_ANALYSIS', 'COMPLETED'];
              const currentIdx = stagesOrder.indexOf(stage);
              const stepIdx = stagesOrder.indexOf(step.key);

              const isDone = stepIdx < currentIdx || stage === 'COMPLETED';
              const isCurrent = stepIdx === currentIdx && stage !== 'COMPLETED';

              return (
                <div key={step.key} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className={`font-medium ${isDone ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stage === 'ERROR' && (
        <div className="py-4">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs flex items-start space-x-2 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Upload Failed</p>
              <p>{error}</p>
            </div>
          </div>
          <button
            onClick={() => setStage('IDLE')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
