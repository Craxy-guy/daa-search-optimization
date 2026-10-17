from algorithms.linear_search import linear_search

def test_element_exists():
    res = linear_search([1, 2, 3], 2)
    assert res['found'] is True
    assert res['index'] == 1

def test_element_missing():
    res = linear_search([1, 2, 3], 4)
    assert res['found'] is False
    assert res['index'] == -1

def test_empty_array():
    res = linear_search([], 1)
    assert res['found'] is False
    assert res['comparisons'] == 0

def test_single_element_found():
    res = linear_search([1], 1)
    assert res['found'] is True

def test_single_element_not_found():
    res = linear_search([1], 2)
    assert res['found'] is False

def test_duplicates():
    res = linear_search([1, 2, 2, 3], 2)
    assert res['index'] == 1

def test_comparisons_count():
    res = linear_search([1, 2, 3, 4, 5], 5)
    assert res['comparisons'] == 5

def test_time_is_positive():
    res = linear_search([1]*1000, 2)
    assert res['time_ns'] >= 0
