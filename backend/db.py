import sqlite3
import os

DB_FILE = 'search_history.db'

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS search_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                algorithm TEXT,
                dataset_size INTEGER,
                target TEXT,
                result_index INTEGER,
                found BOOLEAN,
                comparisons INTEGER,
                time_ns INTEGER,
                is_sorted BOOLEAN,
                dataset_type TEXT
            )
        """)
        conn.commit()

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
