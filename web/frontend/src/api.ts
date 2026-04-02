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

function buildQs(params?: Record<string, string | undefined>): string {
  if (!params) return ''
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  ) as Record<string, string>
  const qs = new URLSearchParams(filtered).toString()
  return qs ? '?' + qs : ''
}

export const api = {
  getCustomers: (params?: { tier?: string; search?: string }) =>
    apiFetch<Customer[]>(`/customers${buildQs(params)}`),

  updateCustomer: (id: number, updates: Partial<Pick<Customer, 'customer_tier'>>) =>
    apiPatch(`/customers/${id}`, updates),

  getProducts: (params?: { category?: string; search?: string }) =>
    apiFetch<Product[]>(`/products${buildQs(params)}`),

  getOrders: (params?: { status?: string; customer_id?: string }) =>
    apiFetch<Order[]>(`/orders${buildQs(params)}`),

  updateOrder: (id: number, updates: Partial<Pick<Order, 'status'>>) =>
    apiPatch(`/orders/${id}`, updates),
}
