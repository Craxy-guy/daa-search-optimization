from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from db import get_db
import csv
import io

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("")
def get_history(db=Depends(get_db)):
    cur = db.execute("SELECT * FROM search_history ORDER BY id DESC")
    return [dict(row) for row in cur.fetchall()]

@router.delete("")
def clear_history(db=Depends(get_db)):
    db.execute("DELETE FROM search_history")
    db.commit()
    return {"status": "cleared"}

@router.get("/export")
def export_history_csv(db=Depends(get_db)):
    cur = db.execute("SELECT * FROM search_history ORDER BY id DESC")
    rows = cur.fetchall()
    
    output = io.StringIO()
    writer = csv.writer(output)
    if rows:
        writer.writerow(rows[0].keys())
        for row in rows:
            writer.writerow(dict(row).values())
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=search_history.csv"}
    )
