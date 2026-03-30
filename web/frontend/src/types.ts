export interface Customer {
  customer_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
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
  _ingest_timestamp: string
}
