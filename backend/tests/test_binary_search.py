from algorithms.binary_search import binary_search
import math

def test_element_exists():
    res = binary_search([1, 2, 3, 4, 5], 3)
    assert res['found'] is True
    assert res['index'] == 2

def test_element_missing():
    res = binary_search([1, 2, 3, 4, 5], 6)
    assert res['found'] is False

def test_first_element():
    res = binary_search([1, 2, 3], 1)
    assert res['index'] == 0

def test_last_element():
    res = binary_search([1, 2, 3], 3)
    assert res['index'] == 2

def test_middle_element():
    res = binary_search([1, 2, 3], 2)
    assert res['index'] == 1

def test_empty_array():
    res = binary_search([], 1)
    assert res['found'] is False

def test_single_element_found():
    res = binary_search([1], 1)
    assert res['found'] is True

def test_single_element_not_found():
    res = binary_search([1], 2)
    assert res['found'] is False

def test_duplicates():
    res = binary_search([1, 2, 2, 3], 2)
    assert res['found'] is True
    assert res['index'] in [1, 2]

def test_unsorted_rejected():
    res = binary_search([3, 1, 2], 1)
    assert 'error' in res
    assert res['error'] == 'UNSORTED_INPUT'

def test_steps_recorded():
    res = binary_search([1, 2, 3], 3)
    assert len(res['steps']) > 0

def test_comparisons_log_n():
    n = 100
    arr = list(range(n))
    res = binary_search(arr, -1)
    assert res.get('error') is None
    assert res['comparisons'] <= math.ceil(math.log2(n)) + 1
