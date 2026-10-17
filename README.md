# AI-Based Search Optimization Using Binary Search, Divide-and-Conquer and Complexity Analysis

> A full-stack web application that serves as an intelligent search strategy advisor — analyzing datasets and recommending optimal search algorithms using rule-based AI decision logic.

## Problem Statement

Given a dataset and query parameters, selecting the most efficient search algorithm is non-trivial. Linear Search works universally but is slow on large data. Binary Search is fast but requires sorted data. The decision to pre-sort depends on dataset size, sort status, and query frequency. This project builds an AI-powered advisor that automates this decision, backed by real benchmark measurements and theoretical complexity analysis.

## Motivation

- Algorithm selection is a core topic in Design and Analysis of Algorithms (DAA)
- Students often learn algorithms in isolation without understanding when to apply each one
- The break-even analysis between sorting + binary search vs. repeated linear search is rarely demonstrated interactively
- This project bridges theory and practice by showing real measurements alongside theoretical complexity

## Objectives

1. Implement Linear Search, Binary Search, and Merge Sort manually (no built-in shortcuts)
2. Build a rule-based AI optimizer that recommends the best search strategy
3. Visualize algorithm behavior step-by-step with animated arrays
4. Benchmark algorithms on real data from n=10 to n=1,000,000
5. Clearly separate theoretical complexity from measured runtime
6. Provide an interactive learning platform for DAA concepts

## Features

### Core Algorithms
- **Linear Search** — O(n) sequential scan with step tracking
- **Binary Search** — O(log n) iterative divide-and-conquer with full step recording (low, mid, high, direction). Refuses unsorted input.
- **Merge Sort** — O(n log n) divide-and-conquer sort with recursion tree visualization

### AI Search Optimizer
- Pure rule-based decision engine (not a black-box ML model)
- Inputs: dataset size (n), sort status, data type, duplicate ratio, query count (q)
- Computes the break-even point where `n·log₂(n) + q·log₂(n) < q·n`
- Generates detailed explanations with worked examples
- Optional LLM-enhanced explanations via OpenAI (works fully offline without it)

### 8 Interactive Pages
1. **Dashboard** — System overview with last search results and AI recommendations
2. **Search Lab** — Run Linear/Binary search, compare both side-by-side, sort-on-demand
3. **AI Optimizer** — Strategy analysis, cost model chart, break-even visualization, "What If?" simulator
4. **Visualizer** — Animated step-by-step array visualization with play/pause/step controls
5. **Benchmark** — Real benchmarks across multiple sizes with interactive charts
6. **Complexity** — Algorithm comparison table and interactive theoretical growth curves
7. **Learn** — Educational content on Binary Search, D&C, Big-O notation, and AI methodology
8. **History** — SQLite-backed search history with CSV export and run comparison

### Data Handling
- Manual input (comma-separated), random generator (sorted/reverse/nearly sorted/duplicate-heavy), CSV upload
- Server-side storage for large datasets (up to 1,000,000 elements)
- Frontend receives summary + preview only (max ~100 elements)

## Architecture

```
┌──────────────────────────┐     HTTP/JSON     ┌──────────────────────────────┐
│     Frontend (React)     │ ←──────────────→  │     Backend (FastAPI)        │
│                          │     Port 5173     │                              │
│  ├── Dashboard           │                   │  ├── /api/dataset/generate   │
│  ├── Search Lab          │                   │  ├── /api/dataset/upload     │
│  ├── AI Optimizer        │                   │  ├── /api/search/linear      │
│  ├── Visualizer          │                   │  ├── /api/search/binary      │
│  ├── Benchmark           │     Port 8000     │  ├── /api/sort/merge         │
│  ├── Complexity          │                   │  ├── /api/optimize           │
│  ├── Learn               │                   │  ├── /api/benchmark          │
│  └── History             │                   │  ├── /api/history            │
│                          │                   │  ├── /api/complexity         │
│  Recharts, Axios         │                   │  └── SQLite (history.db)     │
│  React Router, Tailwind  │                   │      Algorithms, Optimizer   │
└──────────────────────────┘                   └──────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router 6 |
| HTTP Client | Axios |
| Backend Framework | Python FastAPI |
| Database | SQLite 3 |
| Testing | pytest + pytest-asyncio |
| Optional | OpenAI API (for enhanced explanations) |

## Algorithms & Complexity

### Comparison Table

| Algorithm | Best Case | Average Case | Worst Case | Space |
|-----------|-----------|-------------|------------|-------|
| Linear Search | O(1) | O(n) | O(n) | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |

### Binary Search Prerequisites
- Input array **must be sorted** in non-decreasing order
- If unsorted input is provided, the API returns an `UNSORTED_INPUT` error
- The UI prompts the user to sort first using Merge Sort

### Merge Sort (Divide and Conquer)
```
MERGE-SORT(A, l, r)
  if l < r
    mid ← ⌊(l + r) / 2⌋
    MERGE-SORT(A, l, mid)      ← Divide
    MERGE-SORT(A, mid+1, r)    ← Conquer
    MERGE(A, l, mid, r)        ← Combine
```

### Break-Even Analysis
For unsorted data with q queries:
- **Linear Search total cost**: `q × n`
- **Sort + Binary Search total cost**: `n·log₂(n) + q·log₂(n)`
- **Break-even point**: `q = n·log₂(n) / (n - log₂(n))`
- When `q ≥ break-even`: Sort once, then use Binary Search
- When `q < break-even`: Linear Search is more efficient

## AI Methodology

### Decision Logic (Rule-Based, Not ML)

The AI optimizer is a **pure rule-based decision engine**. It does NOT use machine learning or neural networks. The term "AI" refers to automated intelligent decision-making based on formal analysis:

1. **Sorted + Large (n ≥ 1000)**: → Binary Search
2. **Sorted + Small (n < 1000)**: → Compare Both (difference is negligible)
3. **Unsorted + High query count (q ≥ break-even)**: → Sort once (Merge Sort) + Binary Search
4. **Unsorted + Low query count (q < break-even)**: → Linear Search

### Key Principle
> The AI optimizer recommends a strategy but **never changes the theoretical complexity** of any algorithm. Binary Search is always O(log n). Linear Search is always O(n). The optimizer simply selects the best tool for the job.

### LLM Explanation Layer (Optional)
- If `OPENAI_API_KEY` is set in the environment, the optimizer generates richer natural-language explanations using GPT
- The LLM **never influences the decision** — it only explains it
- The app works fully offline with a built-in template explainer

## API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dataset/generate` | POST | Generate dataset (size, type: random/sorted/reverse/nearly_sorted/duplicate_heavy) |
| `/api/dataset/upload` | POST | Upload CSV file with column selection |
| `/api/dataset/{id}` | GET | Get dataset summary by ID |
| `/api/search/linear` | POST | Run Linear Search (array or dataset_id + target) |
| `/api/search/binary` | POST | Run Binary Search (refuses unsorted input) |
| `/api/sort/merge` | POST | Run Merge Sort (updates dataset in-place) |
| `/api/optimize` | POST | Get AI strategy recommendation |
| `/api/benchmark` | POST | Run benchmark suite across multiple sizes |
| `/api/history` | GET | Retrieve search history |
| `/api/history` | DELETE | Clear search history |
| `/api/history/export` | GET | Export history as CSV |
| `/api/complexity` | GET | Get complexity info for all algorithms |

All endpoints return structured JSON with proper error codes.

## Installation & Running

### Prerequisites
- Python 3.9+ with pip
- Node.js 18+ with npm
- (Optional) OpenAI API key for enhanced explanations

### Quick Launch (Windows Batch Files)
- **`start_app.bat`** — Launches both backend & frontend servers and opens the app in your browser automatically.
- **`install_dependencies.bat`** — Installs all Python and npm dependencies.
- **`run_backend.bat`** — Starts only the FastAPI backend server (Port 8000).
- **`run_frontend.bat`** — Starts only the Vite React frontend server (Port 5173).

### Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on `http://localhost:8000`.

### Environment Variables (Optional)
```bash
# For LLM-enhanced explanations (optional, app works without it)
export OPENAI_API_KEY=your_key_here
```

## Testing

```bash
cd backend
python -m pytest tests/ -v
```

### Test Coverage
- **Linear Search**: exists, missing, empty, single element, duplicates, comparison count, timing
- **Binary Search**: exists, missing, first/last/middle element, empty, single, duplicates, unsorted rejection, step recording, comparison bounds
- **Merge Sort**: empty, sorted, reverse, duplicates, single, large random, recursion tree
- **Optimizer**: small unsorted, small sorted, large sorted, large unsorted single query, large unsorted many queries, break-even computation
- **API**: dataset generation, linear/binary search endpoints, unsorted error handling, merge sort, optimizer, history, complexity

## Project Structure

```
DAA project/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── db.py                      # SQLite database layer
│   ├── requirements.txt           # Python dependencies
│   ├── pyproject.toml             # Pytest configuration
│   ├── algorithms/
│   │   ├── linear_search.py       # O(n) sequential search
│   │   ├── binary_search.py       # O(log n) iterative search
│   │   └── merge_sort.py          # O(n log n) divide-and-conquer sort
│   ├── optimizer/
│   │   └── search_optimizer.py    # Rule-based AI decision engine
│   ├── benchmark/
│   │   └── benchmark.py           # Multi-size benchmark runner
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── routes/
│   │   ├── dataset.py             # Dataset generation & upload
│   │   ├── search.py              # Linear & Binary search endpoints
│   │   ├── sort.py                # Merge Sort endpoint
│   │   ├── optimize.py            # AI optimizer endpoint
│   │   ├── benchmark.py           # Benchmark endpoint
│   │   ├── history.py             # Search history CRUD + CSV export
│   │   └── complexity.py          # Algorithm complexity info
│   └── tests/
│       ├── conftest.py            # Test fixtures
│       ├── test_linear_search.py
│       ├── test_binary_search.py
│       ├── test_merge_sort.py
│       ├── test_optimizer.py
│       └── test_api.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                # React Router setup
│       ├── main.jsx               # Entry point
│       ├── index.css              # Global styles & glassmorphism
│       ├── services/
│       │   └── api.js             # Axios API service
│       ├── components/
│       │   ├── Layout.jsx         # Sidebar navigation + header
│       │   ├── GlassCard.jsx      # Reusable glass card
│       │   ├── StatCard.jsx       # Metric display card
│       │   ├── DatasetInput.jsx   # Manual/Generate/Upload tabs
│       │   ├── AlgorithmSteps.jsx # Step-by-step display
│       │   ├── ExportButtons.jsx  # JSON/TXT export
│       │   ├── ComplexityBadge.jsx # Colored complexity badge
│       │   └── LoadingSpinner.jsx # Animated spinner
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── SearchLab.jsx
│       │   ├── AIOptimizer.jsx
│       │   ├── Visualizer.jsx
│       │   ├── Benchmark.jsx
│       │   ├── Complexity.jsx
│       │   ├── Learn.jsx
│       │   └── History.jsx
│       └── charts/
│           ├── BenchmarkChart.jsx
│           ├── CostModelChart.jsx
│           └── ComplexityGraph.jsx
└── README.md
```

## Screenshots

> Screenshots will be added after deployment.

## Results

### Benchmark Results (Sample)
| Dataset Size | Linear Search (ns) | Binary Search (ns) | Sort + Binary (ns) |
|-------------|--------------------|--------------------|---------------------|
| 100 | ~5,000 | ~200 | ~15,000 |
| 1,000 | ~50,000 | ~300 | ~150,000 |
| 10,000 | ~500,000 | ~400 | ~1,500,000 |
| 100,000 | ~5,000,000 | ~500 | ~18,000,000 |
| 1,000,000 | ~50,000,000 | ~600 | ~200,000,000 |

*Note: Actual values depend on hardware. These are representative measurements.*

### Key Observations
1. Binary Search comparisons grow logarithmically: ~17 comparisons for 100,000 elements
2. Linear Search comparisons grow linearly: ~50,000 average for 100,000 elements
3. Sort + Binary Search amortizes over multiple queries
4. The break-even point is computable and visualized in the cost model chart

## Limitations

1. **In-memory datasets**: Large datasets are stored in server memory; a production system would use persistent storage
2. **Single-threaded benchmarks**: Results may vary under system load
3. **Numeric data only**: Currently supports numeric arrays; string/object search not implemented
4. **No persistent datasets**: Datasets are lost on server restart
5. **LLM dependency**: Enhanced explanations require an OpenAI API key and internet connection

## Future Scope

1. **Additional algorithms**: Interpolation Search, Jump Search, Exponential Search, Hash-based Search
2. **Persistent storage**: Database-backed dataset storage with file upload history
3. **Parallel benchmarks**: Multi-threaded benchmark execution
4. **Custom algorithm plugins**: Allow users to add their own search implementations
5. **Mobile app**: React Native version for on-the-go algorithm learning
6. **Collaborative mode**: Multiple users comparing strategies in real-time
7. **Machine Learning**: Train a model on benchmark data to predict optimal strategy for novel datasets

## Team Members

| Name | Role |
|------|------|
| [Your Name] | Full Stack Developer |
| [Team Member 2] | [Role] |
| [Team Member 3] | [Role] |

## License

This project was developed as part of the Design and Analysis of Algorithms (DAA) course curriculum.

---

*Built with ❤️ using React, FastAPI, and algorithmic thinking.*
