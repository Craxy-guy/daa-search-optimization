import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const AlgorithmSteps = ({ steps, algorithm }) => {
  if (!steps || steps.length === 0) {
    return <div className="text-gray-500 italic p-4">No steps recorded.</div>;
  }

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-lg overflow-hidden font-mono text-sm max-h-96 overflow-y-auto">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-3 font-semibold text-gray-300 flex justify-between shadow-md">
        <span>Step Execution Log</span>
        <span className="text-blue-400 capitalize">{algorithm} Search</span>
      </div>
      <div className="p-2 space-y-1">
        {steps.map((step, idx) => (
          <div key={idx} className={`p-3 rounded flex items-center ${idx % 2 === 0 ? 'bg-gray-800/30' : 'bg-transparent'} hover:bg-gray-800/60 transition-colors`}>
            <span className="text-gray-500 w-8">#{idx + 1}</span>
            
            {algorithm === 'binary' ? (
              <div className="flex-1 flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded">low={step.low}</span>
                  <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-800/50">mid={step.mid}</span>
                  <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded">high={step.high}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <span className="text-purple-400">arr[mid]={step.mid_value}</span>
                
                {step.direction && (
                  <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                    {step.direction}
                  </span>
                )}
                {step.match && (
                  <span className="ml-auto flex items-center text-green-400 bg-green-900/20 px-2 py-1 rounded">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Found
                  </span>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-3">
                <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded">index={step.index}</span>
                <span className="text-purple-400">value={step.value}</span>
                {step.match ? (
                  <span className="ml-auto flex items-center text-green-400 bg-green-900/20 px-2 py-1 rounded">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Match!
                  </span>
                ) : (
                  <span className="ml-auto flex items-center text-red-400/70">
                    <XCircle className="w-4 h-4 mr-1" /> no match
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSteps;
