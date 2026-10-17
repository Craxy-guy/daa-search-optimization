import React, { useState } from 'react';
import axios from 'axios';
import { BarChart3, Play, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Benchmark = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/benchmark', {});
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
      alert('Failed to run benchmark');
    } finally {
      setLoading(false);
    }
  };

  const chartData = results?.map(r => {
    const linTime = r.linear?.time_ns ?? r.linear_time_ns ?? 0;
    const linComps = r.linear?.comparisons ?? r.linear_comparisons ?? 0;
    const binTime = r.binary?.time_ns ?? r.binary_time_ns ?? 0;
    const binComps = r.binary?.comparisons ?? r.binary_comparisons ?? 0;
    const sortBinTime = r.sort_binary?.time_ns ?? r.sort_binary_total_ns ?? 0;
    const ratio = binTime > 0 ? (linTime / binTime) : 1;
    return {
      size: r.size,
      linear_time: linTime,
      linear_comps: linComps,
      binary_time: binTime,
      binary_comps: binComps,
      sort_binary_time: sortBinTime,
      ratio: Number(ratio.toFixed(2))
    };
  }) || [];

  return (
    <div className="p-6 space-y-8 animate-fade-in text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Algorithm Benchmarks</h1>
          <p className="text-sm text-gray-400 mt-1">Empirical performance comparison across varying dataset sizes (n=10 to 500,000)</p>
        </div>
        <button 
          onClick={runBenchmark} 
          disabled={loading}
          className="btn-primary flex items-center px-6 py-3 font-semibold"
        >
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
          {loading ? 'Running...' : 'Run Benchmark'}
        </button>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center text-indigo-400 font-semibold animate-pulse border border-indigo-500/30">
          Running empirical benchmarks across multiple dataset sizes... Please wait.
        </div>
      )}

      {results && !loading && (
        <div className="space-y-8 animate-slide-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="glass-card p-5 h-96">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><BarChart3 className="mr-2" size={20}/> Size vs Execution Time (ns)</h3>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="size" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(val) => val.toExponential ? val.toExponential(1) : val}/>
                  <Tooltip contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}} />
                  <Legend />
                  <Line type="monotone" dataKey="linear_time" name="Linear Search (ns)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="binary_time" name="Binary Search (ns)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="sort_binary_time" name="Sort + Binary (ns)" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5 h-96">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><BarChart3 className="mr-2" size={20}/> Size vs Comparisons Count</h3>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="size" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}} />
                  <Legend />
                  <Line type="monotone" dataKey="linear_comps" name="Linear Comparisons" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="binary_comps" name="Binary Comparisons" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5 h-96 lg:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><BarChart3 className="mr-2" size={20}/> Linear vs Binary Speedup Ratio</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="size" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}} />
                  <Legend />
                  <Bar dataKey="ratio" name="Speedup Ratio (Linear / Binary)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          <div className="glass-card overflow-hidden">
            <h3 className="text-xl font-semibold text-white p-4 border-b border-gray-700 bg-gray-900/50">Benchmark Execution Results Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-800/80 text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="p-4">Dataset Size (n)</th>
                    <th className="p-4">Linear Time</th>
                    <th className="p-4">Binary Time</th>
                    <th className="p-4">Sort + Binary Time</th>
                    <th className="p-4">Linear Comps</th>
                    <th className="p-4">Binary Comps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {results.map((r, i) => {
                    const linTime = r.linear?.time_ns ?? r.linear_time_ns ?? 0;
                    const binTime = r.binary?.time_ns ?? r.binary_time_ns ?? 0;
                    const sortBinTime = r.sort_binary?.time_ns ?? r.sort_binary_total_ns ?? 0;
                    const linComps = r.linear?.comparisons ?? r.linear_comparisons ?? 0;
                    const binComps = r.binary?.comparisons ?? r.binary_comparisons ?? 0;
                    return (
                      <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-gray-200">{r.size?.toLocaleString()}</td>
                        <td className="p-4 font-mono text-red-400">{linTime?.toLocaleString()} ns</td>
                        <td className="p-4 font-mono text-green-400">{binTime?.toLocaleString()} ns</td>
                        <td className="p-4 font-mono text-purple-400">{sortBinTime?.toLocaleString()} ns</td>
                        <td className="p-4 font-mono text-gray-300">{linComps?.toLocaleString()}</td>
                        <td className="p-4 font-mono text-gray-300">{binComps?.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benchmark;
