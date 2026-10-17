from fastapi import APIRouter, UploadFile, File, Form
from models.schemas import DatasetGenerateRequest, DatasetUploadResponse
import uuid
import random
import csv
import io

router = APIRouter(prefix="/api/dataset", tags=["dataset"])
datasets = {}
dataset_metadata = {}

def is_sorted_check(arr):
    """O(n) sorted check without using sorted()."""
    for i in range(len(arr) - 1):
        if arr[i] > arr[i + 1]:
            return False
    return True

def count_duplicates(arr):
    """Count duplicate elements."""
    if not arr:
        return 0
    seen = {}
    dupes = 0
    for val in arr:
        if val in seen:
            if seen[val] == 1:
                dupes += 1
            seen[val] += 1
        else:
            seen[val] = 1
    return dupes

def generate_array(size, arr_type):
    """Generate array of given type without using sorted()."""
    if arr_type == "sorted":
        arr = []
        val = random.randint(0, 10)
        for _ in range(size):
            arr.append(val)
            val += random.randint(0, 5)
        return arr
    elif arr_type == "reverse":
        arr = []
        val = size * 5 + random.randint(0, 100)
        for _ in range(size):
            arr.append(val)
            val -= random.randint(0, 5)
        return arr
    elif arr_type == "nearly_sorted":
        # Generate sorted then swap ~5% of elements
        arr = []
        val = random.randint(0, 10)
        for _ in range(size):
            arr.append(val)
            val += random.randint(0, 5)
        swaps = max(1, size // 20)
        for _ in range(swaps):
            i = random.randint(0, size - 1)
            j = random.randint(0, size - 1)
            arr[i], arr[j] = arr[j], arr[i]
        return arr
    elif arr_type == "duplicate_heavy":
        # Only use ~10 distinct values
        distinct = max(2, size // 100)
        values = [random.randint(0, 1000) for _ in range(distinct)]
        return [values[random.randint(0, len(values) - 1)] for _ in range(size)]
    else:  # random
        return [random.randint(0, size * 10) for _ in range(size)]

def make_summary(arr, dataset_id):
    """Create dataset summary with preview."""
    dup_count = count_duplicates(arr)
    return {
        "dataset_id": dataset_id,
        "count": len(arr),
        "min_val": min(arr) if arr else 0,
        "max_val": max(arr) if arr else 0,
        "is_sorted": is_sorted_check(arr),
        "duplicate_count": dup_count,
        "preview": arr[:100],
        "data_type": "numeric"
    }

@router.post("/generate")
def generate_dataset(req: DatasetGenerateRequest):
    if req.size < 1 or req.size > 1000000:
        return {"error": "INVALID_SIZE", "message": "Size must be between 1 and 1,000,000"}
    arr = generate_array(req.size, req.type)
    dataset_id = str(uuid.uuid4())
    datasets[dataset_id] = arr
    return make_summary(arr, dataset_id)

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), column: str = Form(default="0")):
    try:
        content = await file.read()
        text = content.decode('utf-8')
        reader = csv.reader(io.StringIO(text))
        rows = list(reader)
        if not rows:
            return {"error": "EMPTY_CSV", "message": "CSV file is empty"}
        
        # Try to determine column index
        col_idx = 0
        header = rows[0]
        try:
            col_idx = int(column)
        except ValueError:
            # Try to find column by name
            for i, h in enumerate(header):
                if h.strip().lower() == column.strip().lower():
                    col_idx = i
                    break
        
        # Check if first row is header
        start_row = 0
        try:
            float(rows[0][col_idx])
        except (ValueError, IndexError):
            start_row = 1  # Skip header
        
        arr = []
        for row in rows[start_row:]:
            if col_idx < len(row):
                try:
                    val = float(row[col_idx])
                    arr.append(int(val) if val == int(val) else val)
                except ValueError:
                    continue
        
        if not arr:
            return {"error": "NO_NUMERIC_DATA", "message": "No numeric data found in the specified column"}
        
        dataset_id = str(uuid.uuid4())
        datasets[dataset_id] = arr
        return make_summary(arr, dataset_id)
    except Exception as e:
        return {"error": "CSV_PARSE_ERROR", "message": str(e)}

@router.get("/{dataset_id}")
def get_dataset_info(dataset_id: str):
    if dataset_id not in datasets:
        return {"error": "NOT_FOUND", "message": "Dataset not found"}
    return make_summary(datasets[dataset_id], dataset_id)
