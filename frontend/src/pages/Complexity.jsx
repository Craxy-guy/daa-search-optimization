import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import ComplexityGraph from '../charts/ComplexityGraph';

const Complexity = () => {
  const [algoData, setAlgoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/complexity');
        if (res.data && res.data.algorithms) {
          setAlgoData(res.data.algorithms);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const badgeColor = (comp) => {
    if (comp.includes('1')) return 'bg-green-500/20 text-green-400';
    if (comp.includes('log')) return 'bg-blue-500/20 text-blue-400';
    if (comp.includes('n²')) return 'bg-red-500/20 text-red-400';
    if (comp.includes('n log n')) return 'bg-orange-500/20 text-orange-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  const defaultAlgorithms = [
    { name: 'Linear Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', desc: 'Checks each element one by one.' },
    { name: 'Binary Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)', desc: 'Divides sorted array in half repeatedly.' }
  ];

  const dataToUse = algoData.length > 0 ? algoData : defaultAlgorithms;

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-8 h-8 text-blue-400" />
        <h1 className="text-4xl font-bold gradient-text">Time Complexity Analysis</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/80 text-gray-300">
              <tr>
                <th className="p-4 font-semibold">Algorithm</th>
                <th className="p-4 font-semibold">Best Case</th>
                <th className="p-4 font-semibold">Average Case</th>
                <th className="p-4 font-semibold">Worst Case</th>
                <th className="p-4 font-semibold">Space</th>
                <th className="p-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {dataToUse.map((algo, i) => (
                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-medium text-white">{algo.name}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-md text-sm font-mono ${badgeColor(algo.best)}`}>{algo.best}</span></td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-md text-sm font-mono ${badgeColor(algo.average)}`}>{algo.average}</span></td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-md text-sm font-mono ${badgeColor(algo.worst)}`}>{algo.worst}</span></td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-md text-sm font-mono ${badgeColor(algo.space)}`}>{algo.space}</span></td>
                  <td className="p-4 text-gray-400 text-sm">{algo.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-3">Linear Search</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Linear search operates in <strong className="text-yellow-400">O(n)</strong> time complexity because it scans through the dataset element by element. In the worst-case scenario, the target element is at the very end of the array, meaning every single item must be checked. While simple, it scales poorly with large datasets.
          </p>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-3">Binary Search</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Binary search uses a divide-and-conquer strategy, achieving <strong className="text-blue-400">O(log n)</strong> time complexity. It halves the search space at every step. However, it strictly requires the dataset to be sorted beforehand, which itself typically costs <strong className="text-orange-400">O(n log n)</strong> time.
          </p>
        </div>
      </div>

      <div className="glass-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Theoretical Growth Graph</h2>
        <ComplexityGraph />
      </div>

    </div>
  );
};

export default Complexity;
