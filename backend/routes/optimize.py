from fastapi import APIRouter
from models.schemas import OptimizeRequest
from optimizer.search_optimizer import optimize_search

router = APIRouter(prefix="/api/optimize", tags=["optimize"])

@router.post("")
async def do_optimize(req: OptimizeRequest):
    return await optimize_search(req.n, req.is_sorted, req.data_type, req.duplicate_ratio, req.query_count, req.repeated_query_level)
