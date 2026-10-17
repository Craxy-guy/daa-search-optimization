from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db import init_db

from routes import dataset, search, sort, optimize, benchmark, history, complexity

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dataset.router)
app.include_router(search.router)
app.include_router(sort.router)
app.include_router(optimize.router)
app.include_router(benchmark.router)
app.include_router(history.router)
app.include_router(complexity.router)

@app.get("/")
def read_root():
    return {"message": "AI-Based Search Optimization API"}
