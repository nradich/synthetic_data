"""
Shared database connection for Azure Functions.
Reads credentials from environment variables (set via SWA app settings / local.settings.json).
"""

import os
import pyodbc


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
    return pyodbc.connect(connection_string)


def row_to_dict(cursor: pyodbc.Cursor, row) -> dict:
    """Convert a pyodbc row to a plain dict using cursor column names."""
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))
