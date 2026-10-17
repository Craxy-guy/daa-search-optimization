import time

def is_sorted(arr: list) -> bool:
    for i in range(len(arr) - 1):
        if arr[i] > arr[i + 1]:
            return False
    return True

def binary_search(arr: list, target) -> dict:
    if not is_sorted(arr):
        return {
            'error': 'UNSORTED_INPUT',
            'message': 'Binary Search requires sorted data. Sort the dataset first.'
        }
    
    start = time.perf_counter_ns()
    comparisons = 0
    steps = []
    low, high = 0, len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        comparisons += 1
        remaining = high - low + 1
        
        if arr[mid] == target:
            steps.append({
                'low': low, 'mid': mid, 'high': high,
                'mid_value': arr[mid], 'target': target,
                'direction': 'FOUND', 'remaining_size': remaining
            })
            elapsed = time.perf_counter_ns() - start
            return {
                'found': True, 'index': mid, 'comparisons': comparisons,
                'time_ns': elapsed, 'steps': steps
            }
        elif arr[mid] < target:
            steps.append({
                'low': low, 'mid': mid, 'high': high,
                'mid_value': arr[mid], 'target': target,
                'direction': 'RIGHT', 'remaining_size': remaining
            })
            low = mid + 1
        else:
            steps.append({
                'low': low, 'mid': mid, 'high': high,
                'mid_value': arr[mid], 'target': target,
                'direction': 'LEFT', 'remaining_size': remaining
            })
            high = mid - 1
    
    elapsed = time.perf_counter_ns() - start
    return {
        'found': False, 'index': -1, 'comparisons': comparisons,
        'time_ns': elapsed, 'steps': steps
    }

def get_complexity():
    return {
        'algorithm': 'Binary Search',
        'best': 'O(1)',
        'average': 'O(log n)',
        'worst': 'O(log n)',
        'space': 'O(1)',
        'description': 'Divides the sorted search space in half at each step using the divide-and-conquer paradigm.'
    }
