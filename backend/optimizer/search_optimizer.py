import math
import os

def compute_break_even(n: int) -> float:
    """Compute the query count q where sorting becomes worthwhile.
    Break-even: n*log2(n) + q*log2(n) < q*n
    Solving for q: q > n*log2(n) / (n - log2(n))
    """
    if n <= 1:
        return 0.0
    log2_n = math.log2(n)
    denominator = n - log2_n
    if denominator <= 0:
        return float('inf')
    return (n * log2_n) / denominator

def generate_template_explanation(strategy, n, is_sorted, query_count, duplicate_ratio, break_even):
    """Generate a detailed rule-based explanation without LLM."""
    log2_n = math.log2(n) if n > 0 else 0
    
    parts = []
    parts.append(f"Dataset Analysis: n = {n:,} elements.")
    parts.append(f"log₂({n:,}) ≈ {log2_n:.1f}, meaning Binary Search needs at most ~{math.ceil(log2_n)} comparisons in the worst case.")
    parts.append(f"Linear Search would need up to {n:,} comparisons in the worst case.")
    parts.append("")
    
    if is_sorted:
        parts.append("The data is already sorted, so no preprocessing is needed.")
        if n >= 1000:
            parts.append(f"With {n:,} elements, Binary Search's O(log n) = O({log2_n:.1f}) is significantly faster than Linear Search's O(n) = O({n:,}).")
            parts.append(f"Example: Searching for an element requires at most {math.ceil(log2_n)} comparisons with Binary Search vs up to {n:,} with Linear Search.")
        else:
            parts.append(f"With only {n:,} elements, both algorithms complete almost instantly.")
            parts.append("The difference between O(log n) and O(n) is negligible at this scale.")
            parts.append("We recommend trying both to see the measured difference.")
    else:
        parts.append("The data is NOT sorted. Binary Search cannot be used directly.")
        parts.append(f"Break-even analysis: Sort cost = O(n log n) = O({n:,} × {log2_n:.1f}) = O({n * log2_n:,.0f}).")
        parts.append(f"Break-even query count ≈ {break_even:.1f} queries.")
        parts.append("")
        
        if query_count >= break_even:
            linear_total = query_count * n
            sort_plus_binary_total = n * log2_n + query_count * log2_n
            parts.append(f"With {query_count:,} queries (≥ break-even of {break_even:.1f}):")
            parts.append(f"  • Linear Search total: {query_count:,} × {n:,} = {linear_total:,.0f} operations")
            parts.append(f"  • Sort + Binary Search total: {n * log2_n:,.0f} + {query_count:,} × {log2_n:.1f} = {sort_plus_binary_total:,.0f} operations")
            parts.append(f"  • Savings: {linear_total - sort_plus_binary_total:,.0f} operations ({(1 - sort_plus_binary_total/linear_total)*100:.1f}% reduction)")
            parts.append("Sorting once and then using Binary Search is the optimal strategy.")
        else:
            parts.append(f"With only {query_count} queries (< break-even of {break_even:.1f}):")
            parts.append(f"The sorting cost of O({n * log2_n:,.0f}) would not be amortized over so few queries.")
            parts.append("Linear Search is more efficient here despite its O(n) per-query cost.")
    
    if duplicate_ratio > 0.3:
        parts.append("")
        parts.append(f"Note: High duplicate ratio ({duplicate_ratio:.0%}) detected. This doesn't change the asymptotic complexity but may affect average-case behavior.")
    
    parts.append("")
    parts.append("Important: The AI optimizer recommends a strategy based on dataset characteristics. It does NOT change the theoretical complexity of any algorithm. Binary Search is always O(log n) and Linear Search is always O(n).")
    
    return "\n".join(parts)

async def optimize_search(n: int, is_sorted: bool, data_type: str, duplicate_ratio: float, query_count: int, repeated_query_level: str) -> dict:
    """Pure rule-based decision engine."""
    break_even = compute_break_even(n)
    log2_n = math.log2(n) if n > 0 else 0
    
    # Decision logic
    if is_sorted:
        if n >= 1000:
            strategy = "Binary Search"
            reason = f"Sorted array with n={n:,}. Binary Search O(log n) ≈ {math.ceil(log2_n)} comparisons vs Linear Search O(n) = {n:,}."
            expected_complexity = "O(log n)"
            preprocessing = "None"
        else:
            strategy = "Compare Both"
            reason = f"Sorted array but small n={n:,}. Difference between O(log n) and O(n) is negligible at this scale."
            expected_complexity = "O(n) vs O(log n)"
            preprocessing = "None"
    else:
        if query_count >= break_even:
            strategy = "Sort + Binary Search"
            reason = f"Unsorted with {query_count:,} queries ≥ break-even point ({break_even:.1f}). Amortized cost is lower."
            expected_complexity = "O(n log n) + O(q log n)"
            preprocessing = "Merge Sort O(n log n)"
        else:
            strategy = "Linear Search"
            reason = f"Unsorted with {query_count} queries < break-even ({break_even:.1f}). Sorting cost not justified."
            expected_complexity = "O(q × n)"
            preprocessing = "None"
    
    # Build report
    report = {
        "dataset_size": n,
        "is_sorted": is_sorted,
        "data_type": data_type,
        "duplicate_ratio": duplicate_ratio,
        "query_frequency": query_count,
        "repeated_query_level": repeated_query_level,
        "recommended_strategy": strategy,
        "reason": reason,
        "expected_complexity": expected_complexity,
        "preprocessing": preprocessing,
        "break_even_point": round(break_even, 2),
        "log2_n": round(log2_n, 2),
        "worst_case_binary": math.ceil(log2_n) if n > 0 else 0,
        "worst_case_linear": n
    }
    
    # Generate explanation
    explanation = generate_template_explanation(strategy, n, is_sorted, query_count, duplicate_ratio, break_even)
    
    # Optionally enhance with LLM
    if os.environ.get("OPENAI_API_KEY"):
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                prompt = f"""You are a DAA (Design and Analysis of Algorithms) teaching assistant. 
Explain why '{strategy}' is recommended for: n={n}, sorted={is_sorted}, queries={query_count}, break-even={break_even:.1f}.
Mention the exact complexity classes. Never claim AI makes algorithms faster. Be concise and academic."""
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"},
                    json={"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": prompt}], "max_tokens": 500},
                    timeout=5.0
                )
                if res.status_code == 200:
                    explanation = res.json()["choices"][0]["message"]["content"]
        except Exception:
            pass  # Fall back to template explanation
    
    be_queries = round(break_even, 2) if (break_even != float('inf') and break_even > 0) else None
    return {
        "strategy": strategy,
        "reason": reason,
        "complexity": expected_complexity,
        "expected_complexity": expected_complexity,
        "preprocessing_needed": preprocessing != "None",
        "preprocessing": preprocessing,
        "break_even_queries": be_queries,
        "break_even_point": be_queries,
        "report": report,
        "explanation": explanation
    }
