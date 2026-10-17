import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Trash2, Download, GitCompare } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/history`);
      setHistory(res.data.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      try {
        await axios.delete(`${API_BASE}/history`);
        setHistory([]);
        setSelectedIds([]);
      } catch (e) {
        console.error(e);
        alert('Failed to clear history');
      }
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'search_history.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      alert('Export failed, generating client side fallback.');
      
      // Fallback CSV generation if endpoint fails
      const headers = ['Timestamp', 'Algorithm', 'Size', 'Target', 'Found', 'Comparisons', 'Time(ns)'];
      const rows = history.map(h => [
        h.timestamp, h.algorithm, h.dataset_size, h.target, h.found, h.comparisons, h.time_ns
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "search_history_fallback.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id]; // Keep only max 2 selections
    });
  };

  const selectedData = history.filter(h => selectedIds.includes(h.id));

  return (
    <div className="p-6 space-y-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-text flex items-center">
          <HistoryIcon className="mr-3" size={32}/> Search History
        </h1>
        <div className="space-x-3">
          <button onClick={handleExport} className="btn-secondary px-4 py-2 text-sm flex items-center inline-flex">
            <Download size={16} className="mr-2"/> Export CSV
          </button>
          <button onClick={handleClearHistory} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center inline-flex" disabled={history.length === 0}>
            <Trash2 size={16} className="mr-2"/> Clear
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden shadow-lg border border-gray-800">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500">
            <HistoryIcon size={64} className="mb-4 opacity-50" />
            <p className="text-xl font-medium">No search history found.</p>
            <p className="text-sm mt-2">Run some searches in the Search Lab to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-900 text-gray-300 uppercase font-semibold text-xs border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4">Compare</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Algorithm</th>
                  <th className="px-6 py-4">Size (n)</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Comparisons</th>
                  <th className="px-6 py-4">Time (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-800/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-indigo-900/20' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium capitalize">{item.algorithm}</td>
                    <td className="px-6 py-4 font-mono">{item.dataset_size.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono">{item.target}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.found ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                        {item.found ? 'FOUND' : 'MISS'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-yellow-400 font-mono">{item.comparisons}</td>
                    <td className="px-6 py-4 text-blue-400 font-mono">{(item.time_ns / 1000000).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedIds.length === 2 && (
        <div className="glass-card p-6 rounded-xl animate-slide-in mt-8 border-t-4 border-indigo-500">
          <h2 className="text-xl font-bold mb-6 flex items-center"><GitCompare className="mr-2"/> Run Comparison</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {selectedData.map((data, index) => {
              const other = selectedData[index === 0 ? 1 : 0];
              const isFaster = data.time_ns < other.time_ns;
              const fewerComps = data.comparisons < other.comparisons;
              
              return (
                <div key={data.id} className={`flex-1 bg-gray-800 p-5 rounded-lg border ${isFaster ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-gray-700'}`}>
                  <h3 className="text-lg font-bold capitalize mb-4 text-center border-b border-gray-700 pb-2">
                    {data.algorithm} Search {isFaster && '🏆'}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dataset Size:</span>
                      <span className="font-mono">{data.dataset_size.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time (ms):</span>
                      <span className={`font-mono font-bold ${isFaster ? 'text-green-400' : 'text-red-400'}`}>
                        {(data.time_ns / 1000000).toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Comparisons:</span>
                      <span className={`font-mono font-bold ${fewerComps ? 'text-green-400' : 'text-red-400'}`}>
                        {data.comparisons}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Result:</span>
                      <span className={data.found ? 'text-green-400' : 'text-red-400'}>
                        {data.found ? 'Found' : 'Not Found'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
