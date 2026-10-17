import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Brain, Download, Zap, TrendingUp, Cpu, Settings2, BarChart2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const AIOptimizer = () => {
  const [n, setN] = useState(10000);
  const [isSorted, setIsSorted] = useState(false);
  const [dataType, setDataType] = useState('random');
  const [duplicateRatio, setDuplicateRatio] = useState(0);
  const [q, setQ] = useState(100);
  const [repeatedQuery, setRepeatedQuery] = useState('low');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Simulation states
  const [simN, setSimN] = useState(10000);
  const [simQ, setSimQ] = useState(100);
  const [simSorted, setSimSorted] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const payload = {
        n,
        is_sorted: isSorted,
        data_type: dataType,
        duplicate_ratio: duplicateRatio,
        query_count: q,
        repeated_query_level: repeatedQuery
      };
      const res = await axios.post(`${API_BASE}/optimize`, payload);
      setResults(res.data);
    } catch (e) {
      console.error(e);
      alert('Error fetching AI optimization');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    if (!results) return;
    const content = format === 'json' ? JSON.stringify(results, null, 2) : 
      `AI Optimizer Report\n\nStrategy: ${results.strategy}\nReason: ${results.reason}\nComplexity: ${results.complexity}\nBreak-Even: ${results.break_even_queries}\n\nExplanation:\n${results.explanation}`;
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-optimizer-report.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate chart data based on form `n` value up to max queries
  const generateChartData = () => {
    const data = [];
    const maxQ = Math.max(q * 2, 100);
    const logN = Math.log2(n);
    for (let i = 1; i <= maxQ; i += Math.max(1, Math.floor(maxQ/20))) {
      data.push({
        queries: i,
        linear: i * n,
        sortBinary: (n * logN) + (i * logN)
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const getTheoreticalOpCount = (n, q, sorted) => {
    if (sorted) {
      return Math.round(q * Math.log2(n)); // Just binary searches
    } else {
      const linearOps = q * n;
      const sortAndBinaryOps = (n * Math.log2(n)) + (q * Math.log2(n));
      return Math.round(Math.min(linearOps, sortAndBinaryOps));
    }
  };

  return (
    <div className="p-6 space-y-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold gradient-text mb-6 flex items-center">
        <Brain className="mr-3" size={32}/> AI Algorithm Optimizer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="glass-card p-6 rounded-xl col-span-1 lg:col-span-1 space-y-6">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 flex items-center">
            <Settings2 className="mr-2"/> Workload Parameters
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Dataset Size (n)</label>
            <input type="number" className="input-field w-full p-2 mb-2" value={n} onChange={e=>setN(Number(e.target.value))} />
            <div className="flex space-x-2">
              {[100, 1000, 10000, 100000].map(val => (
                <button key={val} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={()=>setN(val)}>{val}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
            <span className="text-sm font-medium text-gray-300">Is Data Sorted?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isSorted} onChange={e=>setIsSorted(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Data Type</label>
            <select className="input-field w-full p-2" value={dataType} onChange={e=>setDataType(e.target.value)}>
              <option value="random">Random</option>
              <option value="sorted">Sorted</option>
              <option value="reverse">Reverse Sorted</option>
              <option value="nearly_sorted">Nearly Sorted</option>
              <option value="duplicate_heavy">Duplicate Heavy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
              Duplicate Ratio <span>{duplicateRatio.toFixed(2)}</span>
            </label>
            <input type="range" min="0" max="1" step="0.05" className="w-full accent-indigo-500" value={duplicateRatio} onChange={e=>setDuplicateRatio(Number(e.target.value))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Query Count (q)</label>
            <input type="number" className="input-field w-full p-2 mb-2" value={q} onChange={e=>setQ(Number(e.target.value))} />
            <div className="flex space-x-2">
              {[1, 10, 100, 1000].map(val => (
                <button key={val} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={()=>setQ(val)}>{val}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Repeated Query Level</label>
            <select className="input-field w-full p-2" value={repeatedQuery} onChange={e=>setRepeatedQuery(e.target.value)}>
              <option value="low">Low (mostly unique targets)</option>
              <option value="medium">Medium</option>
              <option value="high">High (many repeated targets)</option>
            </select>
          </div>

          <button className="btn-primary w-full py-3 text-lg font-bold flex justify-center items-center" onClick={handleAnalyze} disabled={loading}>
            {loading ? <span className="animate-pulse">Analyzing...</span> : <><Zap className="mr-2"/> Analyze Optimizer</>}
          </button>
        </div>

        {/* Results & Chart */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {results ? (
            <>
              <div className="glass-card p-6 rounded-xl border-t-4 border-indigo-500 relative overflow-hidden animate-slide-in">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Cpu size={120} />
                </div>
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Recommended Strategy</h2>
                <h3 className="text-3xl font-extrabold mb-4 text-white">{results.strategy}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/80 p-3 rounded">
                    <p className="text-xs text-gray-400">Complexity</p>
                    <p className="font-bold text-yellow-400">{results.complexity}</p>
                  </div>
                  <div className="bg-gray-800/80 p-3 rounded">
                    <p className="text-xs text-gray-400">Preprocessing</p>
                    <p className="font-bold text-blue-400">{results.preprocessing_needed ? 'Required' : 'None'}</p>
                  </div>
                  <div className="bg-gray-800/80 p-3 rounded">
                    <p className="text-xs text-gray-400">Break-even (q)</p>
                    <p className="font-bold text-green-400">≈ {results.break_even_queries ? Math.round(results.break_even_queries) : 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-6">
                  <p className="text-gray-300 italic">"{results.reason}"</p>
                </div>

                <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                  <h4 className="font-semibold text-gray-200 mb-2">Detailed Explanation</h4>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">{results.explanation}</p>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button onClick={()=>handleExport('json')} className="btn-secondary flex items-center text-sm"><Download size={16} className="mr-2"/> Export JSON</button>
                  <button onClick={()=>handleExport('txt')} className="btn-secondary flex items-center text-sm"><Download size={16} className="mr-2"/> Export TXT</button>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-12 rounded-xl flex flex-col items-center justify-center text-gray-500 h-[400px]">
              <Brain size={64} className="mb-4 opacity-50" />
              <p className="text-xl">Configure parameters and click Analyze to view recommendations</p>
            </div>
          )}

          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center"><TrendingUp className="mr-2"/> Cost Model Analysis</h3>
            <p className="text-sm text-gray-400 mb-4">Total theoretical operations based on queries (q) for n={n}</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="queries" stroke="#9CA3AF" label={{ value: 'Number of Queries (q)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}/>
                  <YAxis stroke="#9CA3AF" tickFormatter={(val) => val.toExponential(1)}/>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                  <Legend verticalAlign="top" height={36}/>
                  {results && results.break_even_queries && results.break_even_queries < q*2 && (
                    <ReferenceLine x={Math.round(results.break_even_queries)} stroke="#10B981" strokeDasharray="3 3" label={{ position: 'top', value: 'Break Even', fill: '#10B981' }} />
                  )}
                  <Line type="monotone" dataKey="linear" name="Linear Search (q*n)" stroke="#EF4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sortBinary" name="Sort + Binary (n*log(n) + q*log(n))" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="glass-card p-6 rounded-xl mt-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center"><BarChart2 className="mr-2"/> What-If Simulator</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-4 col-span-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 flex justify-between">Dataset Size (n): {simN.toLocaleString()}</label>
              <input type="range" min="10" max="100000" step="10" value={simN} onChange={e=>setSimN(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 flex justify-between">Queries (q): {simQ.toLocaleString()}</label>
              <input type="range" min="1" max="1000" step="1" value={simQ} onChange={e=>setSimQ(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="simSorted" checked={simSorted} onChange={e=>setSimSorted(e.target.checked)} className="mr-2 rounded bg-gray-800" />
              <label htmlFor="simSorted" className="text-sm font-medium text-gray-300">Data is already sorted</label>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl flex flex-col justify-center items-center text-center border border-gray-700">
            <span className="text-xs text-gray-400 mb-2">⚠️ Theoretical estimate, not measured</span>
            <span className="text-sm font-medium text-gray-300">Estimated Operations</span>
            <span className="text-3xl font-bold text-indigo-400 mt-2">{getTheoreticalOpCount(simN, simQ, simSorted).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptimizer;
