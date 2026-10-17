import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Search, Upload, Shuffle, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Loader2, SortAsc, LayoutList, SplitSquareVertical } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const SearchLab = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [datasetSummary, setDatasetSummary] = useState(null);
  
  // Tab states
  const [manualInput, setManualInput] = useState('');
  const [genSize, setGenSize] = useState(100);
  const [genType, setGenType] = useState('random');
  const [csvFile, setCsvFile] = useState(null);
  
  // Search state
  const [targetQuery, setTargetQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [unsortedError, setUnsortedError] = useState(false);

  const fetchSummary = async (id, type, size) => {
    // Ideally we would fetch summary from API, but we'll simulate if backend doesn't provide
    // The instructions don't mention a specific summary endpoint, we rely on the generate/upload response
  };

  const handleManualSubmit = async () => {
    try {
      setLoading(true);
      const arr = manualInput.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
      
      // Simulate backend response for summary
      const sorted = arr.every((v, i, a) => !i || a[i-1] <= v);
      const unique = new Set(arr);
      
      setDatasetSummary({
        type: 'manual',
        array: arr,
        count: arr.length,
        min: Math.min(...arr),
        max: Math.max(...arr),
        sorted: sorted,
        duplicates: arr.length - unique.size,
        preview: arr.slice(0, 20)
      });
      setSearchResults(null);
      setCompareResults(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/dataset/generate`, { size: genSize, type: genType });
      setDatasetSummary(res.data.summary || {
        dataset_id: res.data.dataset_id,
        count: genSize,
        min: res.data.min ?? 0,
        max: res.data.max ?? 0,
        sorted: res.data.sorted ?? (genType === 'sorted'),
        duplicates: res.data.duplicates ?? 0,
        preview: res.data.preview || []
      });
      setSearchResults(null);
      setCompareResults(null);
    } catch (e) {
      console.error(e);
      alert('Error generating dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!csvFile) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', csvFile);
      const res = await axios.post(`${API_BASE}/dataset/upload`, formData);
      setDatasetSummary(res.data.summary || {
        dataset_id: res.data.dataset_id,
        count: res.data.count,
        min: res.data.min,
        max: res.data.max,
        sorted: res.data.sorted,
        duplicates: res.data.duplicates,
        preview: res.data.preview
      });
      setSearchResults(null);
      setCompareResults(null);
    } catch (e) {
      console.error(e);
      alert('Error uploading dataset');
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async (type) => {
    if (!targetQuery || !datasetSummary) return;
    const target = Number(targetQuery);
    const payload = datasetSummary.dataset_id 
      ? { dataset_id: datasetSummary.dataset_id, target }
      : { array: datasetSummary.array, target };

    setLoading(true);
    setUnsortedError(false);
    
    try {
      const res = await axios.post(`${API_BASE}/search/${type}`, payload);
      return res.data;
    } catch (e) {
      if (e.response?.data?.error === 'UNSORTED_INPUT' || e.response?.data?.detail === 'UNSORTED_INPUT') {
        setUnsortedError(true);
      } else {
        alert(e.response?.data?.error || 'Search error');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLinearSearch = async () => {
    const res = await runSearch('linear');
    if (res) {
      setSearchResults({ type: 'Linear Search', data: res });
      setCompareResults(null);
    }
  };

  const handleBinarySearch = async () => {
    const res = await runSearch('binary');
    if (res) {
      setSearchResults({ type: 'Binary Search', data: res });
      setCompareResults(null);
    }
  };

  const handleCompare = async () => {
    const linear = await runSearch('linear');
    if (!linear) return;
    const binary = await runSearch('binary');
    if (!binary && !unsortedError) return; 
    // If binary fails due to unsorted, we can still show linear vs failed binary
    
    setCompareResults({ linear, binary });
    setSearchResults(null);
  };

  const handleSort = async () => {
    if (!datasetSummary?.dataset_id) {
      // Manual array sort
      if (datasetSummary?.array) {
        const sortedArr = [...datasetSummary.array].sort((a,b)=>a-b);
        setDatasetSummary(prev => ({
          ...prev,
          array: sortedArr,
          sorted: true,
          preview: sortedArr.slice(0, 20)
        }));
        setUnsortedError(false);
      }
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/sort/merge`, { dataset_id: datasetSummary.dataset_id });
      setDatasetSummary(prev => ({
        ...prev,
        sorted: true,
        preview: res.data.preview || prev.preview
      }));
      setUnsortedError(false);
    } catch (e) {
      console.error(e);
      alert('Error sorting dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold gradient-text mb-6">Search Laboratory</h1>
      
      <div className="glass-card p-6 rounded-xl">
        <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-2">
          {['manual', 'generate', 'upload'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize rounded-t-lg transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'manual' && (
          <div className="space-y-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-300">Comma-separated numbers:</label>
            <textarea 
              className="input-field w-full h-24 p-3 bg-gray-800 rounded text-white"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. 5, 2, 9, 1, 7"
            />
            <button className="btn-primary flex items-center" onClick={handleManualSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <LayoutList className="mr-2" />}
              Set Dataset
            </button>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Size (10 - 1,000,000)</label>
                <input 
                  type="number" 
                  min="10" max="1000000"
                  className="input-field w-full p-2 bg-gray-800 rounded"
                  value={genSize}
                  onChange={(e) => setGenSize(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select 
                  className="input-field w-full p-2 bg-gray-800 rounded"
                  value={genType}
                  onChange={(e) => setGenType(e.target.value)}
                >
                  <option value="random">Random</option>
                  <option value="sorted">Sorted</option>
                  <option value="reverse">Reverse</option>
                  <option value="nearly_sorted">Nearly Sorted</option>
                  <option value="duplicate_heavy">Duplicate Heavy</option>
                </select>
              </div>
            </div>
            <button className="btn-primary flex items-center" onClick={handleGenerateSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Shuffle className="mr-2" />}
              Generate Dataset
            </button>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-300">Upload CSV File:</label>
            <input 
              type="file" 
              accept=".csv"
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              onChange={(e) => setCsvFile(e.target.files[0])}
            />
            <button className="btn-primary flex items-center" onClick={handleUploadSubmit} disabled={loading || !csvFile}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
              Upload CSV
            </button>
          </div>
        )}
      </div>

      {datasetSummary && (
        <div className="glass-card p-6 rounded-xl animate-slide-in">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><CheckCircle2 className="text-green-400 mr-2"/> Dataset Active</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="stat-card bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400">Count</p>
              <p className="text-lg font-bold">{datasetSummary.count}</p>
            </div>
            <div className="stat-card bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400">Min</p>
              <p className="text-lg font-bold">{datasetSummary.min}</p>
            </div>
            <div className="stat-card bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400">Max</p>
              <p className="text-lg font-bold">{datasetSummary.max}</p>
            </div>
            <div className="stat-card bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400">Sorted</p>
              <p className="text-lg font-bold flex justify-center items-center">
                {datasetSummary.sorted ? <CheckCircle2 className="text-green-400" size={20}/> : <XCircle className="text-red-400" size={20}/>}
              </p>
            </div>
            <div className="stat-card bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400">Duplicates</p>
              <p className="text-lg font-bold">{datasetSummary.duplicates}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-3 rounded font-mono text-sm text-gray-300 break-all">
            <strong>Preview:</strong> {datasetSummary.preview?.join(', ')}{datasetSummary.count > 20 && '...'}
          </div>

          <div className="mt-8 border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Query</label>
                <input 
                  type="number"
                  className="input-field w-full p-2 bg-gray-800 rounded text-white text-lg"
                  value={targetQuery}
                  onChange={(e) => setTargetQuery(e.target.value)}
                  placeholder="Enter number..."
                />
              </div>
              <button className="btn-secondary flex-1 flex justify-center items-center py-2" onClick={handleLinearSearch} disabled={loading}>
                <ArrowRight className="mr-2" size={18}/> Linear Search
              </button>
              <button className="btn-primary flex-1 flex justify-center items-center py-2" onClick={handleBinarySearch} disabled={loading}>
                <Search className="mr-2" size={18}/> Binary Search
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors flex-1 flex justify-center items-center" onClick={handleCompare} disabled={loading}>
                <SplitSquareVertical className="mr-2" size={18}/> Compare Both
              </button>
            </div>
          </div>

          {unsortedError && (
            <div className="mt-6 bg-red-900/50 border border-red-500 p-4 rounded-lg flex items-center justify-between animate-pulse-glow">
              <div className="flex items-center text-red-200">
                <AlertTriangle className="mr-3" />
                <span>Binary Search requires sorted data. Sort the dataset first?</span>
              </div>
              <button onClick={handleSort} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-medium flex items-center transition-colors">
                <SortAsc className="mr-2" size={18}/> Sort Now (Merge Sort)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Display */}
      {searchResults && (
        <div className="glass-card p-6 rounded-xl animate-fade-in">
          <h3 className="text-2xl font-bold mb-4">{searchResults.type} Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500">
              <p className="text-sm text-gray-400">Status</p>
              <p className={`text-xl font-bold ${searchResults.data.found ? 'text-green-400' : 'text-red-400'}`}>
                {searchResults.data.found ? 'FOUND' : 'NOT FOUND'}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500">
              <p className="text-sm text-gray-400">Index</p>
              <p className="text-xl font-bold">{searchResults.data.index ?? 'N/A'}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500">
              <p className="text-sm text-gray-400">Comparisons</p>
              <p className="text-xl font-bold text-yellow-400">{searchResults.data.comparisons}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500">
              <p className="text-sm text-gray-400">Time (ms)</p>
              <p className="text-xl font-bold text-blue-400">{(searchResults.data.time_ns / 1000000).toFixed(4)}</p>
            </div>
          </div>
          
          <h4 className="font-semibold mb-2 text-gray-300">Algorithm Steps:</h4>
          <div className="bg-gray-950 p-4 rounded-lg font-mono text-sm text-gray-300 h-48 overflow-y-auto">
            {searchResults.data.steps?.map((step, idx) => (
              <div key={idx} className="mb-1 border-b border-gray-800 pb-1">
                {JSON.stringify(step)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Display */}
      {compareResults && (
        <div className="glass-card p-6 rounded-xl animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-center">Comparison</h3>
          <div className="flex flex-col md:flex-row gap-6">
            {['linear', 'binary'].map(type => {
              const res = compareResults[type];
              if (!res) {
                return (
                  <div key={type} className="flex-1 bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center justify-center">
                    <p className="text-red-400 text-center">Failed (Unsorted)</p>
                  </div>
                );
              }
              const isFaster = compareResults.linear && compareResults.binary && (
                type === 'linear' 
                  ? compareResults.linear.time_ns < compareResults.binary.time_ns 
                  : compareResults.binary.time_ns < compareResults.linear.time_ns
              );

              return (
                <div key={type} className={`flex-1 bg-gray-800 p-6 rounded-xl border-2 transition-all ${isFaster ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-gray-700'}`}>
                  <h4 className="text-xl font-bold mb-4 capitalize text-center">{type} Search {isFaster && '🏆'}</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-bold ${res.found ? 'text-green-400' : 'text-red-400'}`}>{res.found ? 'FOUND' : 'NOT FOUND'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Comparisons</span>
                      <span className="font-bold text-yellow-400">{res.comparisons}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Time</span>
                      <span className="font-bold text-blue-400">{(res.time_ns / 1000000).toFixed(4)} ms</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchLab;
