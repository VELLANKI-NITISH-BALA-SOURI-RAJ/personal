import sqlite3
import asyncio
import os
from typing import Callable, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "reel_growth.db")


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # enables dict-like access
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create all tables if they don't exist."""
    conn = _get_connection()
    cur = conn.cursor()

    cur.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            plan_type TEXT NOT NULL DEFAULT 'free',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS reels (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            topic TEXT NOT NULL,
            format TEXT NOT NULL,
            views INTEGER NOT NULL DEFAULT 0,
            likes INTEGER NOT NULL DEFAULT 0,
            comments INTEGER NOT NULL DEFAULT 0,
            shares INTEGER NOT NULL DEFAULT 0,
            length INTEGER NOT NULL DEFAULT 30,
            engagement_rate REAL NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_reels_user_id ON reels(user_id);
        CREATE INDEX IF NOT EXISTS idx_reels_created_at ON reels(created_at);

        CREATE TABLE IF NOT EXISTS scripts_generated (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            topic TEXT NOT NULL,
            script_json TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts_generated(user_id);
    """)

    conn.commit()
    conn.close()
    print("✅ SQLite database initialized at", DB_PATH)


def row_to_dict(row) -> dict:
    if row is None:
        return None
    return dict(row)


def rows_to_list(rows) -> list[dict]:
    return [dict(r) for r in rows]


async def run_query(fn: Callable[[], Any]) -> Any:
    """Run a synchronous DB query in a thread pool."""
    return await asyncio.to_thread(fn)


# ─── DB Operations ─────────────────────────────────────────────────────────────

class DB:
    """Simple synchronous SQLite query helpers."""

    @staticmethod
    def get_user_by_email(email: str) -> dict | None:
        conn = _get_connection()
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()
        return row_to_dict(row)

    @staticmethod
    def get_user_by_id(user_id: str) -> dict | None:
        conn = _get_connection()
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        return row_to_dict(row)

    @staticmethod
    def create_user(user_id: str, email: str, password_hash: str) -> dict:
        conn = _get_connection()
        conn.execute(
            "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
            (user_id, email, password_hash),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        return row_to_dict(row)

    @staticmethod
    def create_reel(data: dict) -> dict:
        import json
        conn = _get_connection()
        conn.execute(
            """INSERT INTO reels (id, user_id, topic, format, views, likes, comments, shares, length, engagement_rate)
               VALUES (:id, :user_id, :topic, :format, :views, :likes, :comments, :shares, :length, :engagement_rate)""",
            data,
        )
        conn.commit()
        row = conn.execute("SELECT * FROM reels WHERE id = ?", (data["id"],)).fetchone()
        conn.close()
        return row_to_dict(row)

    @staticmethod
    def list_reels(user_id: str, limit: int = 50) -> list[dict]:
        conn = _get_connection()
        rows = conn.execute(
            "SELECT * FROM reels WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
            (user_id, limit),
        ).fetchall()
        conn.close()
        return rows_to_list(rows)

    @staticmethod
    def get_reel(reel_id: str, user_id: str) -> dict | None:
        conn = _get_connection()
        row = conn.execute(
            "SELECT * FROM reels WHERE id = ? AND user_id = ?", (reel_id, user_id)
        ).fetchone()
        conn.close()
        return row_to_dict(row)

    @staticmethod
    def delete_reel(reel_id: str, user_id: str) -> bool:
        conn = _get_connection()
        cur = conn.execute(
            "DELETE FROM reels WHERE id = ? AND user_id = ?", (reel_id, user_id)
        )
        conn.commit()
        conn.close()
        return cur.rowcount > 0

    @staticmethod
    def save_script(script_id: str, user_id: str, topic: str, script_json: dict) -> dict:
        import json
        conn = _get_connection()
        conn.execute(
            "INSERT INTO scripts_generated (id, user_id, topic, script_json) VALUES (?, ?, ?, ?)",
            (script_id, user_id, topic, json.dumps(script_json)),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM scripts_generated WHERE id = ?", (script_id,)).fetchone()
        conn.close()
        d = row_to_dict(row)
        if d and isinstance(d.get("script_json"), str):
            d["script_json"] = json.loads(d["script_json"])
        return d

    @staticmethod
    def list_scripts(user_id: str, limit: int = 10) -> list[dict]:
        import json
        conn = _get_connection()
        rows = conn.execute(
            "SELECT * FROM scripts_generated WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
            (user_id, limit),
        ).fetchall()
        conn.close()
        result = rows_to_list(rows)
        for r in result:
            if isinstance(r.get("script_json"), str):
                r["script_json"] = json.loads(r["script_json"])
        return result
