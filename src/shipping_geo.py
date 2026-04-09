"""
Shared US metro coordinates, warehouse reference points, and transit estimates.
Used by synthetic data generators; keep warehouse_id values aligned with WAREHOUSE_SEED_ROWS.
"""

from __future__ import annotations

import math
from datetime import date, timedelta
from typing import List, Tuple

# Labels must match the city string suffix used in customer/shipping addresses (e.g. "100 Main St, New York, NY 10001").
METRO_LOCATIONS: List[dict] = [
    {"label": "New York, NY", "latitude": 40.7128, "longitude": -74.0060},
    {"label": "Los Angeles, CA", "latitude": 34.0522, "longitude": -118.2437},
    {"label": "Chicago, IL", "latitude": 41.8781, "longitude": -87.6298},
    {"label": "Houston, TX", "latitude": 29.7604, "longitude": -95.3698},
    {"label": "Phoenix, AZ", "latitude": 33.4484, "longitude": -112.0740},
]

# warehouse_id starts at 4001 (see schemas / DATASET_CONFIG).
WAREHOUSES: List[dict] = [
    {
        "warehouse_id": 4001,
        "name": "Northeast Fulfillment Center",
        "city": "Secaucus",
        "state": "NJ",
        "postal_code": "07094",
        "latitude": 40.7895,
        "longitude": -74.0565,
    },
    {
        "warehouse_id": 4002,
        "name": "Pacific Distribution Center",
        "city": "Los Angeles",
        "state": "CA",
        "postal_code": "90001",
        "latitude": 34.0522,
        "longitude": -118.2437,
    },
    {
        "warehouse_id": 4003,
        "name": "Central Logistics Hub",
        "city": "Chicago",
        "state": "IL",
        "postal_code": "60607",
        "latitude": 41.8781,
        "longitude": -87.6298,
    },
    {
        "warehouse_id": 4004,
        "name": "Gulf Coast Warehouse",
        "city": "Houston",
        "state": "TX",
        "postal_code": "77002",
        "latitude": 29.7604,
        "longitude": -95.3698,
    },
    {
        "warehouse_id": 4005,
        "name": "Southwest Sort Facility",
        "city": "Phoenix",
        "state": "AZ",
        "postal_code": "85003",
        "latitude": 33.4484,
        "longitude": -112.0740,
    },
]

EARTH_RADIUS_MILES = 3958.8
MILES_PER_TRANSIT_DAY = 450.0
MIN_TRANSIT_DAYS = 1
MAX_TRANSIT_DAYS = 7


def haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in statute miles."""
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    h = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    c = 2 * math.asin(min(1.0, math.sqrt(h)))
    return EARTH_RADIUS_MILES * c


def nearest_warehouse(latitude: float, longitude: float) -> Tuple[int, float]:
    """Returns (warehouse_id, distance_miles) for the closest warehouse."""
    best_id: int = WAREHOUSES[0]["warehouse_id"]
    best_dist: float = float("inf")
    for wh in WAREHOUSES:
        d = haversine_miles(latitude, longitude, wh["latitude"], wh["longitude"])
        if d < best_dist:
            best_dist = d
            best_id = wh["warehouse_id"]
    return best_id, best_dist


def base_transit_days(distance_miles: float) -> int:
    """Map distance to calendar days before loyalty tier adjustment."""
    raw = int(distance_miles // MILES_PER_TRANSIT_DAY) + 1
    return max(MIN_TRANSIT_DAYS, min(MAX_TRANSIT_DAYS, raw))


def transit_days_for(distance_miles: float, customer_tier: str) -> int:
    """
    Gold and Platinum shave one day (minimum 1); Bronze and Silver use base estimate.
    """
    days = base_transit_days(distance_miles)
    tier = (customer_tier or "").strip()
    if tier in ("Gold", "Platinum"):
        days = max(MIN_TRANSIT_DAYS, days - 1)
    return days


def add_calendar_days(order_date_str: str, days: int) -> str:
    """order_date_str as YYYY-MM-DD; returns same format."""
    y, m, d = (int(x) for x in order_date_str.split("-"))
    return (date(y, m, d) + timedelta(days=days)).isoformat()
