import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-slate-900/90 border border-blue-500/20 rounded-xl p-3.5 mb-6 flex items-start space-x-3 text-xs text-slate-300">
      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-blue-300">Human-Review & Legal Disclaimer: </span>
        ContractIQ provides contract intelligence, automated extraction, risk scoring, and decision support for review purposes only. It does not replace legal counsel or constitute formal legal advice.
      </div>
    </div>
  );
};
