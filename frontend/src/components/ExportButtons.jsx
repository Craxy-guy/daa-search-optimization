import React from 'react';
import { Download } from 'lucide-react';

const ExportButtons = ({ data, filename = 'export' }) => {

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = () => {
    let txtStr = '';
    if (Array.isArray(data)) {
      txtStr = data.map(item => JSON.stringify(item)).join('\n');
    } else if (typeof data === 'object') {
      for (const [key, val] of Object.entries(data)) {
        txtStr += `${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}\n`;
      }
    } else {
      txtStr = String(data);
    }
    
    const blob = new Blob([txtStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-4">
      <button onClick={handleExportJSON} className="btn-secondary flex items-center px-4 py-2 text-sm">
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </button>
      <button onClick={handleExportTXT} className="btn-secondary flex items-center px-4 py-2 text-sm">
        <Download className="w-4 h-4 mr-2" />
        Export TXT
      </button>
    </div>
  );
};

export default ExportButtons;
