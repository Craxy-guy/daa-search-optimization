import React, { useState } from 'react';
import { BookOpen, GitMerge, LineChart, BrainCircuit } from 'lucide-react';

const Learn = () => {
  const [activeTab, setActiveTab] = useState('binary');

  const tabs = [
    { id: 'binary', icon: BookOpen, label: 'Binary Search' },
    { id: 'divide', icon: GitMerge, label: 'Divide & Conquer' },
    { id: 'asymptotic', icon: LineChart, label: 'Asymptotic Notation' },
    { id: 'ai', icon: BrainCircuit, label: 'AI & Algorithm Selection' }
  ];

  return (
    <div className="p-6 space-y-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold gradient-text mb-6">Learning Center</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            >
              <Icon size={18} className="mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="glass-card p-8 rounded-xl animate-fade-in min-h-[60vh]">
        {activeTab === 'binary' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Binary Search</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Binary search is an efficient algorithm for finding an item from a <strong>sorted</strong> list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.
            </p>
            <div className="inline-block bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-lg font-medium">
              ⚠️ Prerequisite: Requires sorted data!
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-400">Complexity Analysis</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="font-mono bg-gray-800 px-2 py-1 rounded text-green-400">Best Case: O(1)</span> - Target is at the middle.</li>
                  <li><span className="font-mono bg-gray-800 px-2 py-1 rounded text-yellow-400">Average Case: O(log n)</span></li>
                  <li><span className="font-mono bg-gray-800 px-2 py-1 rounded text-red-400">Worst Case: O(log n)</span> - Target is at ends or not present.</li>
                  <li><span className="font-mono bg-gray-800 px-2 py-1 rounded text-blue-400">Space: O(1)</span> - Iterative implementation.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-indigo-400">Pros & Cons</h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 bg-gray-800 p-4 rounded border-t-2 border-green-500">
                    <strong className="text-green-400 block mb-2">Pros</strong>
                    <ul className="list-disc pl-4 text-gray-300 space-y-1">
                      <li>Extremely fast for large datasets.</li>
                      <li>Logarithmic growth rate.</li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-800 p-4 rounded border-t-2 border-red-500">
                    <strong className="text-red-400 block mb-2">Cons</strong>
                    <ul className="list-disc pl-4 text-gray-300 space-y-1">
                      <li>Data MUST be sorted.</li>
                      <li>Sorting overhead might negate benefits for small datasets.</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-400">Pseudocode</h3>
                <div className="bg-gray-950 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto shadow-inner border border-gray-800">
<pre><code>{`BINARY-SEARCH(A, target)
  low ← 0
  high ← length(A) - 1
  while low ≤ high
    mid ← ⌊(low + high) / 2⌋
    if A[mid] = target
      return mid
    else if A[mid] < target
      low ← mid + 1
    else
      high ← mid - 1
  return NOT-FOUND`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'divide' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Divide & Conquer</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Divide and Conquer is an algorithm design paradigm based on multi-branched recursion. It works by recursively breaking down a problem into two or more sub-problems of the same or related type, until these become simple enough to be solved directly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <h4 className="font-bold text-xl text-indigo-400 mb-2">1. Divide</h4>
                <p className="text-sm text-gray-400">Break the problem into smaller sub-problems.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <h4 className="font-bold text-xl text-purple-400 mb-2">2. Conquer</h4>
                <p className="text-sm text-gray-400">Solve the sub-problems recursively.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <h4 className="font-bold text-xl text-green-400 mb-2">3. Combine</h4>
                <p className="text-sm text-gray-400">Merge the solutions of sub-problems to create the final solution.</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-indigo-400">Classic Examples</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong>Merge Sort:</strong> Divides the array in half, sorts each half recursively, and merges them back together. O(n log n).</li>
                <li><strong>Binary Search:</strong> Divides the search space in half based on comparison, discarding the half where the target cannot exist. O(log n).</li>
                <li><strong>Quick Sort:</strong> Picks a pivot, partitions array around the pivot, recursively sorts sub-arrays.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'asymptotic' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Asymptotic Notation</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Asymptotic notation is used to describe the running time of an algorithm in terms of the input size (n). It helps us evaluate efficiency independent of hardware or language specifics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-800 p-5 rounded-lg border-t-4 border-red-500">
                <h3 className="text-xl font-bold mb-2">Big-O (O)</h3>
                <p className="text-sm text-gray-400 mb-2"><strong>Upper Bound</strong> / Worst Case</p>
                <p className="text-sm text-gray-300">Describes the maximum time an algorithm can take. E.g., Linear Search is O(n).</p>
              </div>
              <div className="bg-gray-800 p-5 rounded-lg border-t-4 border-green-500">
                <h3 className="text-xl font-bold mb-2">Big-Omega (Ω)</h3>
                <p className="text-sm text-gray-400 mb-2"><strong>Lower Bound</strong> / Best Case</p>
                <p className="text-sm text-gray-300">Describes the minimum time an algorithm can take. E.g., Best case of Binary Search is Ω(1).</p>
              </div>
              <div className="bg-gray-800 p-5 rounded-lg border-t-4 border-blue-500">
                <h3 className="text-xl font-bold mb-2">Big-Theta (Θ)</h3>
                <p className="text-sm text-gray-400 mb-2"><strong>Tight Bound</strong> / Average Case</p>
                <p className="text-sm text-gray-300">Describes when upper and lower bounds are the same in asymptotic behavior.</p>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <h3 className="text-xl font-semibold mb-3 text-indigo-400">Common Complexity Classes</h3>
              <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3">Notation</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Example Algorithm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800"><td className="p-3 font-mono">O(1)</td><td className="p-3">Constant</td><td className="p-3">Array index lookup</td></tr>
                  <tr className="border-b border-gray-800"><td className="p-3 font-mono">O(log n)</td><td className="p-3">Logarithmic</td><td className="p-3">Binary Search</td></tr>
                  <tr className="border-b border-gray-800"><td className="p-3 font-mono">O(n)</td><td className="p-3">Linear</td><td className="p-3">Linear Search</td></tr>
                  <tr className="border-b border-gray-800"><td className="p-3 font-mono">O(n log n)</td><td className="p-3">Linearithmic</td><td className="p-3">Merge Sort</td></tr>
                  <tr className="border-b border-gray-800"><td className="p-3 font-mono">O(n²)</td><td className="p-3">Quadratic</td><td className="p-3">Bubble Sort</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">AI & Algorithm Selection</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              AI doesn't change theoretical complexity bounds—O(log n) is always O(log n). Instead, AI acts as a sophisticated heuristic engine that analyzes the workload profile to select the optimal strategy based on the break-even mathematical formulas.
            </p>

            <div className="bg-gray-800 p-6 rounded-xl mt-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-400">The Decision Logic</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold mr-3 shrink-0">1</div>
                  <p><strong>Is data already sorted?</strong> If yes, default to Binary Search immediately.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold mr-3 shrink-0">2</div>
                  <p><strong>Are there very few queries?</strong> If <span className="font-mono">q &lt; break_even</span>, use Linear Search to avoid O(n log n) sorting overhead.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold mr-3 shrink-0">3</div>
                  <p><strong>Is it a high volume of queries?</strong> If <span className="font-mono">q ≥ break_even</span>, it pays off to Sort first, then use Binary Search repeatedly.</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-indigo-400">The Break-Even Formula</h3>
              <div className="bg-gray-950 p-6 rounded-lg font-mono text-center text-lg text-green-400 border border-gray-800 shadow-inner">
                <p>Linear Cost = q * n</p>
                <p>Sort + Binary Cost = (n * log₂n) + (q * log₂n)</p>
                <div className="my-4 border-t border-gray-800 w-1/2 mx-auto"></div>
                <p>q * n = n * log₂n + q * log₂n</p>
                <p>q = (n * log₂n) / (n - log₂n)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
