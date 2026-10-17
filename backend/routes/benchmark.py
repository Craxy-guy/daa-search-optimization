from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from benchmark.benchmark import run_benchmark

router = APIRouter(prefix="/api/benchmark", tags=["benchmark"])

class BenchmarkRequest(BaseModel):
    sizes: Optional[List[int]] = None
    runs_per_size: Optional[int] = 3

@router.post("")
def do_benchmark(req: BenchmarkRequest = BenchmarkRequest()):
    results = run_benchmark(sizes=req.sizes, runs_per_size=req.runs_per_size)
    return {"results": results}
