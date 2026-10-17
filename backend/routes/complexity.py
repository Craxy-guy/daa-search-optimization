from fastapi import APIRouter
from algorithms.linear_search import get_complexity as l_comp
from algorithms.binary_search import get_complexity as b_comp
from algorithms.merge_sort import get_complexity as m_comp

router = APIRouter(prefix="/api/complexity", tags=["complexity"])

@router.get("")
def get_all_complexity():
    return [l_comp(), b_comp(), m_comp()]
