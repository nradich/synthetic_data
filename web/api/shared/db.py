"""
Shared database connection for Azure Functions.
Reads credentials from environment variables (set via SWA app settings / local.settings.json).

Includes retry logic for Azure SQL Serverless cold-start (auto-pause wakeup).
Error codes retried: 40613 (database unavailable), 40197 (service error),
40501 (service busy), 49918 (insufficient resources).
"""

import logging
import os
import time

import pyodbc

# Azure SQL Serverless wakeup / transient error codes found in the error message
_RETRIABLE_CODES = {"40613", "40197", "40501", "49918"}

# Delays in seconds between successive attempts (5 retries = 6 total attempts)
_RETRY_DELAYS = [2, 4, 8, 16, 30]


def get_connection() -> pyodbc.Connection:
    host = os.environ["SQL_SERVER_HOST"]
    database = os.environ["SQL_SERVER_DATABASE"]
    username = os.environ["SQL_SERVER_USERNAME"]
    password = os.environ["SQL_SERVER_PASSWORD"]
    port = os.environ.get("SQL_SERVER_PORT", "1433")

    connection_string = (
        "DRIVER={ODBC Driver 18 for SQL Server};"
        f"SERVER={host},{port};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "Connection Timeout=30;"
    )

    last_exc: Exception = RuntimeError("No connection attempt made")
    max_attempts = len(_RETRY_DELAYS) + 1  # 6 total attempts

    for attempt in range(max_attempts):
        try:
            return pyodbc.connect(connection_string)
        except pyodbc.OperationalError as exc:
            if any(code in str(exc) for code in _RETRIABLE_CODES):
                last_exc = exc
                if attempt < len(_RETRY_DELAYS):
                    delay = _RETRY_DELAYS[attempt]
                    logging.warning(
                        "SQL Server unavailable — attempt %d/%d, retrying in %ds. Error: %s",
                        attempt + 1,
                        max_attempts,
                        delay,
                        exc,
                    )
                    time.sleep(delay)
                else:
                    # Exhausted all retries
                    raise
            else:
                # Non-retriable error (bad credentials, network issue, etc.)
                raise

    raise last_exc


def row_to_dict(cursor: pyodbc.Cursor, row) -> dict:
    """Convert a pyodbc row to a plain dict using cursor column names."""
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))
