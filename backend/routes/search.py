from fastapi import APIRouter, Depends
from models.schemas import SearchRequest, SearchResponse
from routes.dataset import datasets, is_sorted_check
from algorithms.linear_search import linear_search
from algorithms.binary_search import binary_search
from db import get_db

router = APIRouter(prefix="/api/search", tags=["search"])

def log_search(db, algo, arr, target, res):
    if "error" in res:
        return
    sorted_status = is_sorted_check(arr) if len(arr) <= 100000 else False
    db.execute("""
        INSERT INTO search_history (algorithm, dataset_size, target, result_index, found, comparisons, time_ns, is_sorted, dataset_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (algo, len(arr), str(target), res.get('index', -1), res.get('found', False),
          res.get('comparisons', 0), res.get('time_ns', 0), sorted_status, 'numeric'))
    db.commit()

@router.post("/linear")
def do_linear(req: SearchRequest, db=Depends(get_db)):
    arr = datasets.get(req.dataset_id, []) if req.dataset_id else (req.array or [])
    if not arr:
        return {"error": "EMPTY_DATASET", "message": "Dataset is empty"}
    
    # For large arrays, don't return steps to frontend
    res = linear_search(arr, req.target)
    if len(arr) > 100:
        res['steps'] = res.get('steps', [])[:50]  # Limit steps sent to frontend
    
    log_search(db, "Linear Search", arr, req.target, res)
    return res

@router.post("/binary")
def do_binary(req: SearchRequest, db=Depends(get_db)):
    arr = datasets.get(req.dataset_id, []) if req.dataset_id else (req.array or [])
    if not arr:
        return {"error": "EMPTY_DATASET", "message": "Dataset is empty"}
    
    res = binary_search(arr, req.target)
    log_search(db, "Binary Search", arr, req.target, res)
    return res
