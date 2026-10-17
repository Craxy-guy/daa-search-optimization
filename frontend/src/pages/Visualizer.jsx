import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, StepForward, RotateCcw, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const Visualizer = () => {
  const [arrayInput, setArrayInput] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
  const [targetInput, setTargetInput] = useState('23');
  const [algo, setAlgo] = useState('binary');
  
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const timerRef = useRef(null);

  const handleVisualize = async () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    const parsedArray = arrayInput.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
    const target = Number(targetInput);
    setArray(parsedArray);

    try {
      // For binary search we must ensure array is sorted visually
      if (algo === 'binary') {
        const sorted = [...parsedArray].sort((a,b)=>a-b);
        if (JSON.stringify(sorted) !== JSON.stringify(parsedArray)) {
          alert('Array sorted automatically for Binary Search visualizer.');
          setArray(sorted);
          const res = await axios.post(`${API_BASE}/search/binary`, { array: sorted, target });
          setSteps(res.data.steps || []);
          return;
        }
      }
      
      const res = await axios.post(`${API_BASE}/search/${algo}`, { array: parsedArray, target });
      setSteps(res.data.steps || []);
    } catch (e) {
      console.error(e);
      alert('Error fetching steps');
    }
  };

  useEffect(() => {
    if (isPlaying && steps.length > 0 && currentStepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps, speed]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const stepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  // Compute Box Colors
  const getBoxStyle = (idx) => {
    if (currentStepIndex === -1) return "bg-slate-800 text-gray-300 border-gray-600";
    
    const step = steps[currentStepIndex];
    if (!step) return "bg-slate-800 text-gray-300 border-gray-600";
    
    if (algo === 'binary') {
      if (step.mid === idx) {
        if (array[idx] === Number(targetInput) || step.direction === 'FOUND') return "bg-green-600 text-white border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-105 font-extrabold";
        return "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] scale-105 font-bold";
      }
      if (idx === step.low) return "bg-slate-700 text-white border-green-500 border-2";
      if (idx === step.high) return "bg-slate-700 text-white border-red-500 border-2";
      if (idx < step.low || idx > step.high) return "bg-slate-900 text-gray-600 border-gray-800 opacity-30"; // eliminated
      return "bg-slate-800 text-gray-300 border-gray-600";
    } else {
      // Linear
      const currIdx = step.current !== undefined ? step.current : step.index;
      if (currIdx === idx) {
        if (array[idx] === Number(targetInput) || step.match) return "bg-green-600 text-white border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-105 font-extrabold";
        return "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] scale-105 font-bold";
      }
      if (currIdx !== undefined && idx < currIdx) return "bg-slate-900 text-gray-600 border-gray-800 opacity-30"; // checked
      return "bg-slate-800 text-gray-300 border-gray-600";
    }
  };

  const generateHalvingChain = () => {
    let size = array.length;
    const chain = [];
    while(size > 0) {
      chain.push(size);
      size = Math.floor(size / 2);
    }
    return chain;
  };

  return (
    <div className="p-6 space-y-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold gradient-text mb-6 flex items-center">
        <Activity className="mr-3" size={32}/> Algorithm Visualizer
      </h1>

      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">Array (comma separated)</label>
            <input type="text" className="input-field w-full p-2" value={arrayInput} onChange={e=>setArrayInput(e.target.value)} />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-300 mb-1">Target</label>
            <input type="number" className="input-field w-full p-2" value={targetInput} onChange={e=>setTargetInput(e.target.value)} />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-300 mb-1">Algorithm</label>
            <select className="input-field w-full p-2" value={algo} onChange={e=>setAlgo(e.target.value)}>
              <option value="binary">Binary Search</option>
              <option value="linear">Linear Search</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary py-2 px-6" onClick={handleVisualize}>Visualize</button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl text-center min-h-[250px] flex flex-col justify-center">
        {array.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in">
            {array.map((num, idx) => (
              <div key={idx} className={`w-12 h-12 flex items-center justify-center font-bold rounded-lg border-2 transition-all duration-300 ${getBoxStyle(idx)}`}>
                {num}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Enter data and click Visualize to start</p>
        )}

        <div className="flex items-center justify-center space-x-6">
          <button onClick={reset} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><RotateCcw size={20}/></button>
          <button onClick={togglePlay} className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors text-white shadow-lg">
            {isPlaying ? <Pause size={24}/> : <Play size={24} className="ml-1"/>}
          </button>
          <button onClick={stepForward} disabled={isPlaying} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"><StepForward size={20}/></button>
        </div>
        <div className="mt-4 flex justify-center items-center space-x-4">
          <span className="text-sm text-gray-400">Speed:</span>
          <input type="range" min="200" max="2000" step="200" value={2200 - speed} onChange={e=>setSpeed(2200 - Number(e.target.value))} className="w-48 accent-indigo-500"/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Step Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                <tr>
                  <th className="px-4 py-3">Step</th>
                  {algo === 'binary' && <><th className="px-4 py-3">Low</th><th className="px-4 py-3">High</th><th className="px-4 py-3">Mid</th></>}
                  {algo === 'linear' && <th className="px-4 py-3">Index</th>}
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Decision</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, idx) => {
                  const currIdx = step.current !== undefined ? step.current : step.index;
                  const stepVal = algo === 'binary' 
                    ? (step.mid_value !== undefined ? step.mid_value : array[step.mid]) 
                    : (step.value !== undefined ? step.value : array[currIdx]);
                  const stepDecision = step.decision || step.direction || (step.match ? 'Match Found' : (step.found ? 'Match Found' : 'No Match (Continue)'));
                  const isFound = step.match || step.direction === 'FOUND' || array[currIdx] === Number(targetInput);

                  return (
                    <tr key={idx} className={`border-b border-gray-800 transition-colors ${idx === currentStepIndex ? 'bg-indigo-900/40 text-white font-semibold' : ''}`}>
                      <td className="px-4 py-3 font-mono">{idx + 1}</td>
                      {algo === 'binary' && (
                        <>
                          <td className="px-4 py-3 font-mono text-green-400">{step.low}</td>
                          <td className="px-4 py-3 font-mono text-red-400">{step.high}</td>
                          <td className="px-4 py-3 font-mono text-blue-400">{step.mid}</td>
                        </>
                      )}
                      {algo === 'linear' && <td className="px-4 py-3 font-mono text-blue-400">{currIdx}</td>}
                      <td className="px-4 py-3 font-mono font-bold">{stepVal}</td>
                      <td className="px-4 py-3 font-medium">
                        {isFound ? (
                          <span className="text-green-400 font-bold">✓ {stepDecision}</span>
                        ) : (
                          <span className="text-gray-300">{stepDecision}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {steps.length === 0 && (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No steps recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex flex-col">
          <h3 className="text-xl font-bold mb-4">Concepts</h3>
          {algo === 'binary' ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-indigo-400 mb-2">Halving Chain</h4>
                <div className="flex flex-wrap items-center text-sm font-mono text-gray-300">
                  {array.length > 0 ? generateHalvingChain().map((s, i, arr) => (
                    <React.Fragment key={i}>
                      <span>{s}</span>
                      {i < arr.length - 1 && <span className="mx-2 text-gray-600">→</span>}
                    </React.Fragment>
                  )) : '...'}
                </div>
              </div>
              <div className="flex-1 border border-gray-700 rounded-lg p-4 bg-gray-900 flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-4">Divide & Conquer</div>
                <div className="bg-indigo-600 text-white text-xs py-1 px-3 rounded mb-2 w-full text-center font-bold">Divide Space</div>
                <div className="flex w-full space-x-2 mb-2">
                  <div className="bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded flex-1 text-center border-l-2 border-green-500">Left</div>
                  <div className="bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded flex-1 text-center border-r-2 border-red-500">Right</div>
                </div>
                <div className="bg-blue-600 text-white text-xs py-1 px-3 rounded w-full text-center font-bold">Compare Mid</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Sequential Scanning</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Checks elements one-by-one from index <code className="text-blue-400 font-mono">0</code> up to <code className="text-blue-400 font-mono">n-1</code> until a match is found or end of array.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-gray-800 p-2 rounded border border-gray-700">
                    <span className="text-gray-400 block">Time Complexity:</span>
                    <span className="text-amber-400 font-bold">O(N)</span>
                  </div>
                  <div className="bg-gray-800 p-2 rounded border border-gray-700">
                    <span className="text-gray-400 block">Space Complexity:</span>
                    <span className="text-green-400 font-bold">O(1)</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900 flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-3 font-semibold">Step-by-Step Traversal</div>
                <div className="flex items-center space-x-2 w-full mb-3">
                  <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-300"
                      style={{ 
                        width: `${steps.length > 0 && currentStepIndex >= 0 ? Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100)) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-300">
                    {currentStepIndex >= 0 ? `${currentStepIndex + 1}/${steps.length}` : `0/${steps.length || 0}`}
                  </span>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  {currentStepIndex >= 0 && steps[currentStepIndex] ? (
                    <span className="text-indigo-300 font-mono">
                      Checking arr[{steps[currentStepIndex].current ?? steps[currentStepIndex].index}] = {steps[currentStepIndex].value ?? array[steps[currentStepIndex].current ?? steps[currentStepIndex].index]}
                    </span>
                  ) : (
                    "Press Play or Step to start visualization"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
