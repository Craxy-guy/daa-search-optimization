from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any
from routes.dataset import datasets
from algorithms.merge_sort import merge_sort

router = APIRouter(prefix="/api/sort", tags=["sort"])

class SortRequest(BaseModel):
    dataset_id: Optional[str] = None
    array: Optional[List[Any]] = None

@router.post("/merge")
def do_merge_sort(req: SortRequest):
    arr = datasets.get(req.dataset_id, []) if req.dataset_id else (req.array or [])
    result = merge_sort(arr)
    # Update the dataset in place with sorted array
    if req.dataset_id and req.dataset_id in datasets:
        datasets[req.dataset_id] = result['sorted_array']
    return result
