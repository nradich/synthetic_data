"""
E-commerce Dataset Schemas for Synthetic Data Generation
Defines structure for customers, products, warehouses, and orders datasets
"""

# Customer dataset schema
CUSTOMER_SCHEMA = {
    "name": "customers",
    "description": "Customer information for e-commerce store",
    "fields": {
        "customer_id": {
            "type": "sequence",
            "description": "Unique customer identifier starting from 1001"
        },
        "first_name": {
            "type": "llm_generated", 
            "description": "Customer's first name - common American names"
        },
        "last_name": {
            "type": "llm_generated",
            "description": "Customer's last name - realistic surnames"
        },
        "email": {
            "type": "llm_generated",
            "description": "Customer email address in format firstname.lastname@domain.com"
        },
        "phone": {
            "type": "llm_generated", 
            "description": "US phone number in format (XXX) XXX-XXXX"
        },
        "address": {
            "type": "llm_generated",
            "description": "Full street address including city, state, ZIP"
        },
        "latitude": {
            "type": "llm_generated",
            "description": "Customer latitude (decimal degrees, continental US)"
        },
        "longitude": {
            "type": "llm_generated",
            "description": "Customer longitude (decimal degrees, continental US)"
        },
        "registration_date": {
            "type": "llm_generated",
            "description": "Date customer registered, between 2023-01-01 and 2024-12-31"
        },
        "customer_tier": {
            "type": "choice",
            "options": ["Bronze", "Silver", "Gold", "Platinum"],
            "description": "Customer loyalty tier"
        }
    }
}

# Product dataset schema  
PRODUCT_SCHEMA = {
    "name": "products", 
    "description": "Product catalog for e-commerce store",
    "fields": {
        "product_id": {
            "type": "sequence",
            "description": "Unique product identifier starting from 2001"
        },
        "product_name": {
            "type": "llm_generated",
            "description": "Product name for consumer electronics, clothing, or home goods"
        },
        "category": {
            "type": "choice", 
            "options": ["Electronics", "Clothing", "Home & Garden", "Books", "Sports", "Beauty"],
            "description": "Product category"
        },
        "price": {
            "type": "llm_generated",
            "description": "Product price between $5.99 and $999.99 in format $XX.XX"
        },
        "description": {
            "type": "llm_generated",
            "description": "Brief product description highlighting key features"
        },
        "stock_quantity": {
            "type": "llm_generated", 
            "description": "Available inventory count between 0 and 500"
        },
        "brand": {
            "type": "llm_generated",
            "description": "Product brand name - mix of well-known and fictional brands"
        },
        "rating": {
            "type": "llm_generated",
            "description": "Average customer rating between 1.0 and 5.0 stars"
        }
    }
}

# Orders dataset schema
ORDER_SCHEMA = {
    "name": "orders",
    "description": "Customer orders for e-commerce store", 
    "fields": {
        "order_id": {
            "type": "sequence",
            "description": "Unique order identifier starting from 3001"
        },
        "customer_id": {
            "type": "llm_generated",
            "description": "Customer ID between 1001 and 1020 (matching customer dataset)"
        },
        "product_id": {
            "type": "llm_generated", 
            "description": "Product ID between 2001 and 2020 (matching product dataset)"
        },
        "order_date": {
            "type": "llm_generated",
            "description": "Order date between 2024-01-01 and 2024-12-31"
        },
        "quantity": {
            "type": "llm_generated",
            "description": "Quantity ordered between 1 and 5 items"
        },
        "total_amount": {
            "type": "llm_generated", 
            "description": "Total order amount in format $XX.XX between $5.99 and $2999.99"
        },
        "status": {
            "type": "choice",
            "options": ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            "description": "Current order status"
        },
        "shipping_address": {
            "type": "llm_generated",
            "description": "Shipping address - can match customer address or be different"
        },
        "warehouse_id": {
            "type": "llm_generated",
            "description": "Origin warehouse id (4001-4005) nearest to customer"
        },
        "estimated_transit_days": {
            "type": "llm_generated",
            "description": "Estimated calendar days in transit after tier adjustment"
        },
        "estimated_delivery_date": {
            "type": "llm_generated",
            "description": "order_date plus estimated_transit_days (YYYY-MM-DD)"
        }
    }
}

# Warehouse reference data (ids align with shipping_geo.WAREHOUSES)
WAREHOUSE_SCHEMA = {
    "name": "warehouses",
    "description": "Distribution and fulfillment warehouse locations",
    "fields": {
        "warehouse_id": {
            "type": "sequence",
            "description": "Unique warehouse identifier starting from 4001"
        },
        "name": {
            "type": "llm_generated",
            "description": "Facility name"
        },
        "city": {
            "type": "llm_generated",
            "description": "City"
        },
        "state": {
            "type": "llm_generated",
            "description": "US state (2-letter)"
        },
        "postal_code": {
            "type": "llm_generated",
            "description": "ZIP code"
        },
        "latitude": {
            "type": "llm_generated",
            "description": "Latitude in decimal degrees"
        },
        "longitude": {
            "type": "llm_generated",
            "description": "Longitude in decimal degrees"
        }
    }
}

# Dataset generation configuration (order: customers, products, warehouses, then orders)
DATASET_CONFIG = {
    "customers": {
        "schema": CUSTOMER_SCHEMA,
        "record_count": 20,
        "filename": "customers.json"
    },
    "products": {
        "schema": PRODUCT_SCHEMA,
        "record_count": 20,
        "filename": "products.json"
    },
    "warehouses": {
        "schema": WAREHOUSE_SCHEMA,
        "record_count": 5,
        "filename": "warehouses.json"
    },
    "orders": {
        "schema": ORDER_SCHEMA,
        "record_count": 30,
        "filename": "orders.json"
    }
}