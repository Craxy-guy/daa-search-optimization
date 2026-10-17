from fastapi.testclient import TestClient
import pytest

def get_client():
    """Create a fresh TestClient for each test."""
    from main import app
    return TestClient(app)

def test_generate_dataset():
    client = get_client()
    with client:
        response = client.post("/api/dataset/generate", json={"size": 10, "type": "random"})
        assert response.status_code == 200
        data = response.json()
        assert "dataset_id" in data
        assert data["count"] == 10

def test_linear_search_endpoint():
    client = get_client()
    with client:
        response = client.post("/api/search/linear", json={"array": [1, 2, 3, 4, 5], "target": 3})
        assert response.status_code == 200
        data = response.json()
        assert data["found"] is True
        assert data["index"] == 2

def test_binary_search_endpoint():
    client = get_client()
    with client:
        response = client.post("/api/search/binary", json={"array": [1, 2, 3, 4, 5], "target": 4})
        assert response.status_code == 200
        data = response.json()
        assert data["found"] is True

def test_binary_search_unsorted_error():
    client = get_client()
    with client:
        response = client.post("/api/search/binary", json={"array": [3, 1, 2], "target": 2})
        assert response.status_code == 200
        data = response.json()
        assert "error" in data
        assert data["error"] == "UNSORTED_INPUT"

def test_merge_sort_endpoint():
    client = get_client()
    with client:
        response = client.post("/api/sort/merge", json={"array": [3, 1, 2]})
        assert response.status_code == 200
        data = response.json()
        assert data["sorted_array"] == [1, 2, 3]

def test_optimize_endpoint():
    client = get_client()
    with client:
        response = client.post("/api/optimize", json={
            "n": 10000, "is_sorted": True, "data_type": "random",
            "duplicate_ratio": 0.0, "query_count": 100, "repeated_query_level": "high"
        })
        assert response.status_code == 200
        data = response.json()
        assert "strategy" in data
        assert data["strategy"] == "Binary Search"

def test_history_endpoints():
    client = get_client()
    with client:
        # Clear first
        client.delete("/api/history")
        # Do a search to create history
        client.post("/api/search/linear", json={"array": [1, 2, 3], "target": 2})
        # Check history
        response = client.get("/api/history")
        assert response.status_code == 200
        history = response.json()
        assert len(history) >= 1

def test_complexity_endpoint():
    client = get_client()
    with client:
        response = client.get("/api/complexity")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        algorithms = [d["algorithm"] for d in data]
        assert "Linear Search" in algorithms
        assert "Binary Search" in algorithms
        assert "Merge Sort" in algorithms
