import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Shuffle, Edit3, Loader2 } from 'lucide-react';

const DatasetInput = ({ onDatasetReady }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);

  // Manual state
  const [manualData, setManualData] = useState('');
  
  // Generate state
  const [genSize, setGenSize] = useState(100);
  const [genType, setGenType] = useState('random');

  // Upload state
  const [file, setFile] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/dataset/generate', {
        size: genSize,
        type: genType
      });
      onDatasetReady(res.data);
    } catch (err) {
      console.error(err);
      alert('Error generating dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleManual = async () => {
    if (!manualData.trim()) return;
    setLoading(true);
    try {
      const parsed = manualData.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      const res = await axios.post('http://localhost:8000/api/dataset/manual', {
        data: parsed
      });
      onDatasetReady(res.data);
    } catch (err) {
      console.error(err);
      alert('Error saving manual dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:8000/api/dataset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onDatasetReady(res.data);
    } catch (err) {
      console.error(err);
      alert('Error uploading dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 w-full max-w-2xl mx-auto">
      <div className="flex space-x-2 border-b border-gray-700 mb-6 pb-2">
        <button onClick={() => setActiveTab('generate')} className={`flex-1 py-2 px-4 rounded-t-lg transition flex items-center justify-center space-x-2 ${activeTab === 'generate' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><Shuffle className="w-4 h-4"/> <span>Generate</span></button>
        <button onClick={() => setActiveTab('manual')} className={`flex-1 py-2 px-4 rounded-t-lg transition flex items-center justify-center space-x-2 ${activeTab === 'manual' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><Edit3 className="w-4 h-4"/> <span>Manual</span></button>
        <button onClick={() => setActiveTab('upload')} className={`flex-1 py-2 px-4 rounded-t-lg transition flex items-center justify-center space-x-2 ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><Upload className="w-4 h-4"/> <span>Upload</span></button>
      </div>

      <div className="min-h-[200px]">
        {activeTab === 'generate' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Dataset Size</label>
              <input type="number" min="1" max="1000000" value={genSize} onChange={e => setGenSize(parseInt(e.target.value) || 100)} className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Distribution Type</label>
              <select value={genType} onChange={e => setGenType(e.target.value)} className="input-field w-full">
                <option value="random">Random (Unsorted)</option>
                <option value="sorted">Sorted</option>
                <option value="reverse">Reverse Sorted</option>
              </select>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Generate Data
            </button>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Enter numbers separated by commas</label>
              <textarea 
                rows="4" 
                value={manualData} 
                onChange={e => setManualData(e.target.value)} 
                placeholder="10, 25, 4, 18, 99..." 
                className="input-field w-full resize-none font-mono"
              />
            </div>
            <button onClick={handleManual} disabled={loading} className="btn-primary w-full flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Parse Data
            </button>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input type="file" accept=".csv,.txt" onChange={e => setFile(e.target.files[0])} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2 text-gray-400 hover:text-blue-400">
                <Upload className="w-10 h-10 mb-2" />
                <span className="font-semibold">{file ? file.name : "Click to select CSV or TXT file"}</span>
              </label>
            </div>
            <button onClick={handleUpload} disabled={!file || loading} className="btn-primary w-full flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Upload Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetInput;
