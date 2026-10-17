import time

def merge_sort(arr: list) -> dict:
    comparisons = [0]
    recursive_calls = [0]
    tree = []
    
    start = time.perf_counter_ns()
    sorted_arr = _merge_sort_recursive(list(arr), comparisons, recursive_calls, tree, 0)
    elapsed = time.perf_counter_ns() - start
    
    return {
        'sorted_array': sorted_arr,
        'comparisons': comparisons[0],
        'recursive_calls': recursive_calls[0],
        'time_ns': elapsed,
        'recursion_tree': tree if len(arr) <= 64 else []
    }

def _merge_sort_recursive(arr, comparisons, recursive_calls, tree, depth):
    recursive_calls[0] += 1
    node = {'depth': depth, 'array': arr[:] if len(arr) <= 64 else f'[{len(arr)} elements]', 'type': 'leaf' if len(arr) <= 1 else 'split'}
    
    if len(arr) <= 1:
        if len(arr) <= 64:
            tree.append(node)
        return arr
    
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    if len(arr) <= 64:
        node['left_sub'] = left[:]
        node['right_sub'] = right[:]
        tree.append(node)
    
    sorted_left = _merge_sort_recursive(left, comparisons, recursive_calls, tree, depth + 1)
    sorted_right = _merge_sort_recursive(right, comparisons, recursive_calls, tree, depth + 1)
    
    return _merge(sorted_left, sorted_right, comparisons)

def _merge(left, right, comparisons):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        comparisons[0] += 1
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    while i < len(left):
        result.append(left[i])
        i += 1
    while j < len(right):
        result.append(right[j])
        j += 1
    return result

def get_complexity():
    return {
        'algorithm': 'Merge Sort',
        'best': 'O(n log n)',
        'average': 'O(n log n)',
        'worst': 'O(n log n)',
        'space': 'O(n)',
        'description': 'A divide-and-conquer sorting algorithm that splits the array, recursively sorts halves, and merges them.'
    }
