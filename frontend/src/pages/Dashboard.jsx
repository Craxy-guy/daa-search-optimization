import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Database, Zap, Clock, GitBranch, ArrowRight, Brain, Search, BarChart3, BookOpen, Eye, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [lastSearch, setLastSearch] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyRes = await axios.get('http://localhost:8000/api/history');
        if (historyRes.data && historyRes.data.length > 0) {
          setLastSearch(historyRes.data[0]);
          
          const optRes = await axios.post('http://localhost:8000/api/optimize', {
            dataset_size: historyRes.data[0].dataset_size || 1000,
            search_queries: 5,
            is_sorted: false
          });
          setAiRecommendation(optRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const flowSteps = [
    { icon: Database, label: 'Dataset', desc: 'Input data' },
    { icon: Brain, label: 'AI Recommendation', desc: 'Smart choice' },
    { icon: Search, label: 'Algorithm', desc: 'Select search' },
    { icon: GitBranch, label: 'Divide & Conquer', desc: 'Binary search' },
    { icon: BookOpen, label: 'Complexity', desc: 'Big-O analysis' },
    { icon: BarChart3, label: 'Benchmark', desc: 'Compare speed' },
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center p-8"><Zap className="animate-pulse w-8 h-8 text-blue-500" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card glass-card p-6 flex flex-col items-center justify-center">
              <Database className="w-8 h-8 mb-4 text-blue-400" />
              <h3 className="text-xl text-gray-300">Last Search Size</h3>
              <p className="text-3xl font-bold text-white">{lastSearch ? lastSearch.dataset_size : 'No data yet'}</p>
            </div>
            <div className="stat-card glass-card p-6 flex flex-col items-center justify-center">
              <Clock className="w-8 h-8 mb-4 text-green-400" />
              <h3 className="text-xl text-gray-300">Last Search Time</h3>
              <p className="text-3xl font-bold text-white">{lastSearch ? `${lastSearch.time_ns} ns` : 'No data yet'}</p>
            </div>
            <div className="stat-card glass-card p-6 flex flex-col items-center justify-center">
              <Brain className="w-8 h-8 mb-4 text-purple-400" />
              <h3 className="text-xl text-gray-300">Algorithm Used</h3>
              <p className="text-3xl font-bold text-white">{lastSearch ? lastSearch.algorithm : 'No data yet'}</p>
            </div>
          </div>

          {aiRecommendation && (
            <div className="glass-card p-6 border-l-4 border-purple-500">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-semibold text-white">AI Recommendation</h2>
              </div>
              <p className="text-gray-300 mb-2">Based on your last search size of {lastSearch.dataset_size}:</p>
              <p className="text-lg font-medium text-white mb-2">Recommended: <span className="text-purple-400">{aiRecommendation.recommended_algorithm}</span></p>
              <p className="text-sm text-gray-400">{aiRecommendation.reasoning}</p>
            </div>
          )}

          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Learning Flow</h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {flowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center max-w-[120px]">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg mb-3">
                      <step.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <span className="font-semibold text-white text-sm">{step.label}</span>
                    <span className="text-xs text-gray-400 mt-1">{step.desc}</span>
                  </div>
                  {idx < flowSteps.length - 1 && <ArrowRight className="w-6 h-6 text-gray-600 hidden md:block" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => navigate('/visualize')} className="btn-primary p-6 flex flex-col items-center justify-center space-y-4 hover:scale-[1.02] transition-transform">
              <Eye className="w-10 h-10" />
              <span className="text-xl font-semibold">Visualize Algorithms</span>
              <span className="text-sm opacity-80">Watch search algorithms in action</span>
            </button>
            <button onClick={() => navigate('/benchmark')} className="btn-secondary p-6 flex flex-col items-center justify-center space-y-4 hover:scale-[1.02] transition-transform">
              <BarChart3 className="w-10 h-10" />
              <span className="text-xl font-semibold">Run Benchmarks</span>
              <span className="text-sm opacity-80">Compare algorithm performance</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
