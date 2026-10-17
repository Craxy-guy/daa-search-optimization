import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SearchLab from './pages/SearchLab';
import AIOptimizer from './pages/AIOptimizer';
import Visualizer from './pages/Visualizer';
import Benchmark from './pages/Benchmark';
import Complexity from './pages/Complexity';
import Learn from './pages/Learn';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="search-lab" element={<SearchLab />} />
          <Route path="optimizer" element={<AIOptimizer />} />
          <Route path="visualizer" element={<Visualizer />} />
          <Route path="benchmark" element={<Benchmark />} />
          <Route path="complexity" element={<Complexity />} />
          <Route path="learn" element={<Learn />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
