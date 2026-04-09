export interface Customer {
  customer_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  latitude?: number
  longitude?: number
  registration_date: string
  customer_tier: string
  _ingest_timestamp: string
}

export interface Product {
  product_id: number
  product_name: string
  category: string
  price: string
  description: string
  stock_quantity: number
  brand: string
  rating: number
  _ingest_timestamp: string
}

export interface Order {
  order_id: number
  customer_id: number
  product_id: number
  order_date: string
  quantity: number
  total_amount: string
  status: string
  shipping_address: string
  warehouse_id?: number | null
  warehouse_name?: string | null
  warehouse_city?: string | null
  estimated_transit_days?: number | null
  estimated_delivery_date?: string | null
  _ingest_timestamp: string
}

export interface Warehouse {
  warehouse_id: number
  name: string
  city: string
  state: string
  postal_code: string
  latitude: number
  longitude: number
  _ingest_timestamp: string
}
