from algorithms.merge_sort import merge_sort

def test_empty():
    assert merge_sort([])['sorted_array'] == []

def test_sorted_input():
    assert merge_sort([1, 2, 3])['sorted_array'] == [1, 2, 3]

def test_reverse_input():
    assert merge_sort([3, 2, 1])['sorted_array'] == [1, 2, 3]

def test_duplicates():
    assert merge_sort([2, 1, 2])['sorted_array'] == [1, 2, 2]

def test_single_element():
    assert merge_sort([1])['sorted_array'] == [1]

def test_large_random():
    import random
    arr = [random.randint(0, 1000) for _ in range(1000)]
    res = merge_sort(arr)
    assert res['sorted_array'] == sorted(arr)

def test_recursion_tree_small():
    res = merge_sort([1, 2, 3])
    assert len(res['recursion_tree']) > 0

def test_recursion_tree_large():
    res = merge_sort(list(range(65)))
    assert len(res['recursion_tree']) == 0
