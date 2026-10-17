import random
import time
from algorithms.linear_search import linear_search
from algorithms.binary_search import binary_search
from algorithms.merge_sort import merge_sort

def run_benchmark(sizes=None, runs_per_size=3):
    """Run comprehensive benchmark across multiple sizes.
    Returns results with time and comparison data for charting.
    """
    if sizes is None:
        sizes = [10, 100, 1000, 10000, 100000, 500000]
    
    results = []
    
    for size in sizes:
        linear_times = []
        linear_comps = []
        binary_times = []
        binary_comps = []
        sort_times = []
        sort_comps = []
        sort_binary_total_times = []
        
        for run in range(runs_per_size):
            # Generate random array
            arr = [random.randint(0, size * 10) for _ in range(size)]
            # Pick a target that exists
            target = arr[random.randint(0, len(arr) - 1)]
            
            # Linear search
            ls_result = linear_search(arr, target)
            linear_times.append(ls_result['time_ns'])
            linear_comps.append(ls_result['comparisons'])
            
            # Merge sort the array
            ms_result = merge_sort(arr)
            sorted_arr = ms_result['sorted_array']
            sort_times.append(ms_result['time_ns'])
            sort_comps.append(ms_result['comparisons'])
            
            # Binary search on sorted array
            bs_result = binary_search(sorted_arr, target)
            binary_times.append(bs_result['time_ns'])
            binary_comps.append(bs_result['comparisons'])
            
            # Sort + Binary total
            sort_binary_total_times.append(ms_result['time_ns'] + bs_result['time_ns'])
        
        def avg(lst):
            return sum(lst) / len(lst) if lst else 0
        
        avg_lin_time = max(1, round(avg(linear_times)))
        avg_lin_comps = round(avg(linear_comps))
        avg_bin_time = max(1, round(avg(binary_times)))
        avg_bin_comps = round(avg(binary_comps))
        avg_sort_time = max(1, round(avg(sort_times)))
        avg_sort_comps = round(avg(sort_comps))
        avg_sb_time = max(1, round(avg(sort_binary_total_times)))
        
        results.append({
            'size': size,
            'linear_time_ns': avg_lin_time,
            'linear_comparisons': avg_lin_comps,
            'binary_time_ns': avg_bin_time,
            'binary_comparisons': avg_bin_comps,
            'sort_time_ns': avg_sort_time,
            'sort_comparisons': avg_sort_comps,
            'sort_binary_total_ns': avg_sb_time,
            'linear': {
                'time_ns': avg_lin_time,
                'comparisons': avg_lin_comps
            },
            'binary': {
                'time_ns': avg_bin_time,
                'comparisons': avg_bin_comps
            },
            'sort_binary': {
                'time_ns': avg_sb_time,
                'comparisons': avg_sort_comps + avg_bin_comps
            },
            'runs': runs_per_size
        })
    
    return results
