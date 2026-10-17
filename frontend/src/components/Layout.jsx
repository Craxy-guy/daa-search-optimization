import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Search, Brain, Eye, BarChart3, GitBranch, BookOpen, Clock, Menu } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/search-lab', icon: Search, label: 'Search Lab' },
    { to: '/optimizer', icon: Brain, label: 'AI Optimizer' },
    { to: '/visualizer', icon: Eye, label: 'Visualizer' },
    { to: '/benchmark', icon: BarChart3, label: 'Benchmark' },
    { to: '/complexity', icon: GitBranch, label: 'Complexity' },
    { to: '/learn', icon: BookOpen, label: 'Learn' },
    { to: '/history', icon: Clock, label: 'History' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-card rounded-none border-t-0 border-b-0 border-l-0 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-primary-500/10">
            <h1 className="text-xl font-bold gradient-text">AI Search Opt</h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 glass-card rounded-none border-t-0 border-l-0 border-r-0 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200 focus:outline-none"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold ml-2 md:ml-0 hidden sm:block">
              AI-Based Search Optimization
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              System Online
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
