import pytest
import sqlite3
import os
import sys

# Add backend root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import db as db_module

TEST_DB = "test_search_history.db"

@pytest.fixture(autouse=True)
def setup_db(tmp_path):
    """Use a unique temp DB for each test to avoid Windows file lock issues."""
    test_db = str(tmp_path / "test.db")
    # Monkey-patch the DB_FILE in the db module
    original_db = db_module.DB_FILE
    db_module.DB_FILE = test_db
    db_module.init_db()
    yield
    db_module.DB_FILE = original_db
