import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BenchmarkChart = ({ data, xKey, yKeys, colors, title }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      {title && <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {yKeys.map((key, i) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={colors[i % colors.length]} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BenchmarkChart;
