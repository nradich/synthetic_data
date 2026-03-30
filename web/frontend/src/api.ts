import type { Customer, Order, Product } from './types'

const BASE = '/api'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}

async function apiPatch(path: string, body: Record<string, unknown>): Promise<void> {
  const res = await fetch(BASE + path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
}

export const api = {
  getCustomers: (params?: { tier?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiFetch<Customer[]>(`/customers${qs ? '?' + qs : ''}`)
  },
  updateCustomer: (id: number, updates: Partial<Pick<Customer, 'customer_tier'>>) =>
    apiPatch(`/customers/${id}`, updates),

  getProducts: (params?: { category?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiFetch<Product[]>(`/products${qs ? '?' + qs : ''}`)
  },

  getOrders: (params?: { status?: string; customer_id?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiFetch<Order[]>(`/orders${qs ? '?' + qs : ''}`)
  },
  updateOrder: (id: number, updates: Partial<Pick<Order, 'status'>>) =>
    apiPatch(`/orders/${id}`, updates),
}
