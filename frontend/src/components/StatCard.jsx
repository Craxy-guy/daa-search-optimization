import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  return (
    <div className="stat-card">
      {Icon && <Icon className={`w-8 h-8 mb-2 text-${color}-400`} />}
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1 text-slate-100">{value}</p>
    </div>
  );
};

export default StatCard;
