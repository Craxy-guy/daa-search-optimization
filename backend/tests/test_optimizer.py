from optimizer.search_optimizer import optimize_search, compute_break_even
import pytest

@pytest.mark.asyncio
async def test_small_unsorted():
    res = await optimize_search(500, False, "random", 0.0, 1, "low")
    assert res['strategy'] == "Linear Search"

@pytest.mark.asyncio
async def test_small_sorted():
    res = await optimize_search(500, True, "sorted", 0.0, 1, "low")
    assert res['strategy'] == "Compare Both"

@pytest.mark.asyncio
async def test_large_sorted():
    res = await optimize_search(2000, True, "sorted", 0.0, 1, "low")
    assert res['strategy'] == "Binary Search"

@pytest.mark.asyncio
async def test_large_unsorted_single_query():
    res = await optimize_search(2000, False, "random", 0.0, 1, "low")
    assert res['strategy'] == "Linear Search"

@pytest.mark.asyncio
async def test_large_unsorted_many_queries():
    res = await optimize_search(2000, False, "random", 0.0, 1000, "high")
    assert res['strategy'] == "Sort + Binary Search"

def test_break_even_computed():
    be = compute_break_even(100)
    assert be > 0
