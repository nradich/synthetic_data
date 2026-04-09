import json
import logging
import azure.functions as func
from shared.db import get_connection, row_to_dict

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="customers", methods=["GET"])
def get_customers(req: func.HttpRequest) -> func.HttpResponse:
    tier = req.params.get("tier")
    search = req.params.get("search")

    query = "SELECT * FROM [syn_data].[customers]"
    conditions = []
    params = []

    if tier:
        conditions.append("customer_tier = ?")
        params.append(tier)
    if search:
        conditions.append("(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)")
        like = f"%{search}%"
        params.extend([like, like, like])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY customer_id"

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return func.HttpResponse(
            json.dumps(rows, default=str),
            mimetype="application/json",
            status_code=200,
        )
    except Exception as e:
        logging.exception("Error fetching customers")
        return func.HttpResponse(str(e), status_code=500)


@app.route(route="customers/{customer_id}", methods=["PATCH"])
def update_customer(req: func.HttpRequest) -> func.HttpResponse:
    customer_id = req.route_params.get("customer_id")

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid JSON body", status_code=400)

    allowed_fields = {"customer_tier"}
    updates = {k: v for k, v in body.items() if k in allowed_fields}
    if not updates:
        return func.HttpResponse("No updatable fields provided", status_code=400)

    set_clause = ", ".join(f"[{k}] = ?" for k in updates)
    params = list(updates.values()) + [customer_id]

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                f"UPDATE [syn_data].[customers] SET {set_clause} WHERE customer_id = ?",
                params,
            )
            conn.commit()
        return func.HttpResponse(status_code=204)
    except Exception as e:
        logging.exception("Error updating customer")
        return func.HttpResponse(str(e), status_code=500)


@app.route(route="products", methods=["GET"])
def get_products(req: func.HttpRequest) -> func.HttpResponse:
    category = req.params.get("category")
    search = req.params.get("search")

    query = "SELECT * FROM [syn_data].[products]"
    conditions = []
    params = []

    if category:
        conditions.append("category = ?")
        params.append(category)
    if search:
        conditions.append("(product_name LIKE ? OR brand LIKE ?)")
        like = f"%{search}%"
        params.extend([like, like])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY product_id"

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return func.HttpResponse(
            json.dumps(rows, default=str),
            mimetype="application/json",
            status_code=200,
        )
    except Exception as e:
        logging.exception("Error fetching products")
        return func.HttpResponse(str(e), status_code=500)


@app.route(route="warehouses", methods=["GET"])
def get_warehouses(req: func.HttpRequest) -> func.HttpResponse:
    query = """
SELECT * FROM [syn_data].[warehouses]
ORDER BY warehouse_id
"""
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            rows = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return func.HttpResponse(
            json.dumps(rows, default=str),
            mimetype="application/json",
            status_code=200,
        )
    except Exception as e:
        logging.exception("Error fetching warehouses")
        return func.HttpResponse(str(e), status_code=500)


@app.route(route="orders", methods=["GET"])
def get_orders(req: func.HttpRequest) -> func.HttpResponse:
    status = req.params.get("status")
    customer_id = req.params.get("customer_id")

    query = """
SELECT o.*, w.[name] AS warehouse_name, w.[city] AS warehouse_city
FROM [syn_data].[orders] o
LEFT JOIN [syn_data].[warehouses] w ON o.warehouse_id = w.warehouse_id
"""
    conditions = []
    params = []

    if status:
        conditions.append("o.[status] = ?")
        params.append(status)
    if customer_id:
        conditions.append("o.customer_id = ?")
        params.append(customer_id)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY o.order_id"

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return func.HttpResponse(
            json.dumps(rows, default=str),
            mimetype="application/json",
            status_code=200,
        )
    except Exception as e:
        logging.exception("Error fetching orders")
        return func.HttpResponse(str(e), status_code=500)


@app.route(route="orders/{order_id}", methods=["PATCH"])
def update_order(req: func.HttpRequest) -> func.HttpResponse:
    order_id = req.route_params.get("order_id")

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid JSON body", status_code=400)

    allowed_fields = {"status"}
    updates = {k: v for k, v in body.items() if k in allowed_fields}
    if not updates:
        return func.HttpResponse("No updatable fields provided", status_code=400)

    set_clause = ", ".join(f"[{k}] = ?" for k in updates)
    params = list(updates.values()) + [order_id]

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                f"UPDATE [syn_data].[orders] SET {set_clause} WHERE order_id = ?",
                params,
            )
            conn.commit()
        return func.HttpResponse(status_code=204)
    except Exception as e:
        logging.exception("Error updating order")
        return func.HttpResponse(str(e), status_code=500)
