import React from 'react';

const ComplexityBadge = ({ complexity }) => {
  const getBadgeColor = () => {
    if (complexity.includes('O(1)')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (complexity.includes('O(log n)')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (complexity.includes('O(n)')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (complexity.includes('O(n log n)')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (complexity.includes('O(n^2)')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-mono border ${getBadgeColor()}`}>
      {complexity}
    </span>
  );
};

export default ComplexityBadge;
