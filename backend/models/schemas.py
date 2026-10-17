from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class DatasetGenerateRequest(BaseModel):
    size: int
    type: str

class DatasetUploadResponse(BaseModel):
    dataset_id: str
    count: int
    min_val: float
    max_val: float
    is_sorted: bool
    duplicate_count: int
    preview: List[Any]

class SearchRequest(BaseModel):
    dataset_id: Optional[str] = None
    array: Optional[List[Any]] = None
    target: Any

class SearchResponse(BaseModel):
    found: Optional[bool] = None
    index: Optional[int] = None
    comparisons: Optional[int] = None
    time_ns: Optional[int] = None
    steps: Optional[List[Dict[str, Any]]] = None
    complexity: Optional[Dict[str, str]] = None
    error: Optional[str] = None
    message: Optional[str] = None

class OptimizeRequest(BaseModel):
    n: int
    is_sorted: bool
    data_type: str
    duplicate_ratio: float
    query_count: int
    repeated_query_level: str

class BenchmarkResponse(BaseModel):
    results: List[Dict[str, Any]]
