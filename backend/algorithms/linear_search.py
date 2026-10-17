import time

def linear_search(arr: list, target) -> dict:
    start = time.perf_counter_ns()
    comparisons = 0
    steps = []
    for i in range(len(arr)):
        comparisons += 1
        is_match = (arr[i] == target)
        steps.append({
            'index': i,
            'current': i,
            'value': arr[i],
            'compared_with': target,
            'match': is_match,
            'decision': 'Match Found' if is_match else 'No Match (Continue)'
        })
        if is_match:
            elapsed = time.perf_counter_ns() - start
            return {
                'found': True,
                'index': i,
                'comparisons': comparisons,
                'time_ns': elapsed,
                'steps': steps
            }
    elapsed = time.perf_counter_ns() - start
    return {
        'found': False,
        'index': -1,
        'comparisons': comparisons,
        'time_ns': elapsed,
        'steps': steps
    }

def get_complexity():
    return {
        'algorithm': 'Linear Search',
        'best': 'O(1)',
        'average': 'O(n)',
        'worst': 'O(n)',
        'space': 'O(1)',
        'description': 'Sequentially checks each element until the target is found or the list ends.'
    }
