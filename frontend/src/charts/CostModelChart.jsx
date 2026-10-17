import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CostModelChart = ({ n }) => {
  const data = useMemo(() => {
    const points = [];
    const maxQ = Math.max(1000, n);
    const step = Math.max(1, Math.floor(maxQ / 50));
    
    for (let q = 1; q <= maxQ; q += step) {
      points.push({
        queries: q,
        linearTotal: q * n,
        sortBinaryTotal: (n * Math.log2(n)) + (q * Math.log2(n))
      });
    }
    return points;
  }, [n]);

  const breakEven = data.find(d => d.sortBinaryTotal <= d.linearTotal)?.queries;

  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold text-white mb-2">Cost Model: Linear vs Sort + Binary (n = {n})</h3>
      <p className="text-sm text-gray-400 mb-4">Break-even point around ~{breakEven || '>1000'} queries</p>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="queries" stroke="#9ca3af" label={{ value: 'Number of Queries (q)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" label={{ value: 'Total Operations', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
          <Legend verticalAlign="top" height={36} />
          {breakEven && <ReferenceLine x={breakEven} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: 'Break Even', fill: '#fbbf24' }} />}
          <Line type="monotone" dataKey="linearTotal" name="Linear Search (q * n)" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sortBinaryTotal" name="Sort + Binary Search (n log n + q log n)" stroke="#a855f7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostModelChart;
