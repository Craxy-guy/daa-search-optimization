import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComplexityGraph = () => {
  const [toggles, setToggles] = useState({
    constant: true,
    logarithmic: true,
    linear: true,
    linearithmic: true
  });

  const data = useMemo(() => {
    const points = [];
    for (let n = 1; n <= 10000; n += 200) {
      points.push({
        n,
        constant: 1,
        logarithmic: Math.log2(n),
        linear: n,
        linearithmic: n * Math.log2(n)
      });
    }
    return points;
  }, []);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-4 mb-2">
        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={toggles.constant} onChange={() => handleToggle('constant')} className="rounded text-green-500 focus:ring-green-500 bg-gray-800 border-gray-600" />
          <span className="text-green-400 font-mono">O(1)</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={toggles.logarithmic} onChange={() => handleToggle('logarithmic')} className="rounded text-blue-500 focus:ring-blue-500 bg-gray-800 border-gray-600" />
          <span className="text-blue-400 font-mono">O(log n)</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={toggles.linear} onChange={() => handleToggle('linear')} className="rounded text-yellow-500 focus:ring-yellow-500 bg-gray-800 border-gray-600" />
          <span className="text-yellow-400 font-mono">O(n)</span>
        </label>
        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={toggles.linearithmic} onChange={() => handleToggle('linearithmic')} className="rounded text-orange-500 focus:ring-orange-500 bg-gray-800 border-gray-600" />
          <span className="text-orange-400 font-mono">O(n log n)</span>
        </label>
      </div>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="n" stroke="#9ca3af" label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" label={{ value: 'Operations', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend />
            {toggles.constant && <Line type="monotone" dataKey="constant" name="O(1)" stroke="#22c55e" strokeWidth={2} dot={false} />}
            {toggles.logarithmic && <Line type="monotone" dataKey="logarithmic" name="O(log n)" stroke="#3b82f6" strokeWidth={2} dot={false} />}
            {toggles.linear && <Line type="monotone" dataKey="linear" name="O(n)" stroke="#eab308" strokeWidth={2} dot={false} />}
            {toggles.linearithmic && <Line type="monotone" dataKey="linearithmic" name="O(n log n)" stroke="#f97316" strokeWidth={2} dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplexityGraph;
