import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Order } from '../types'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    api.getOrders({ status: status || undefined, customer_id: customerId || undefined })
      .then(setOrders)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  const handleCustomerSearch = (e: React.FormEvent) => { e.preventDefault(); load() }

  const saveEdit = async (id: number) => {
    await api.updateOrder(id, { status: editStatus })
    setEditingId(null)
    load()
  }

  return (
    <div className="page">
      <h2>Orders</h2>
      <div className="toolbar">
        <form onSubmit={handleCustomerSearch}>
          <input
            placeholder="Filter by customer ID..."
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            type="number"
          />
          <button type="submit">Filter</button>
        </form>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Product</th><th>Date</th>
              <th>Qty</th><th>Total</th><th>Status</th><th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id}>
                <td>{o.order_id}</td>
                <td>{o.customer_id}</td>
                <td>{o.product_id}</td>
                <td>{o.order_date?.slice(0, 10)}</td>
                <td>{o.quantity}</td>
                <td>${o.total_amount}</td>
                <td>
                  {editingId === o.order_id ? (
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span className={`badge status-${o.status?.toLowerCase()}`}>{o.status}</span>
                  )}
                </td>
                <td>
                  {editingId === o.order_id ? (
                    <>
                      <button onClick={() => saveEdit(o.order_id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => { setEditingId(o.order_id); setEditStatus(o.status) }}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="count">{orders.length} records</p>
    </div>
  )
}
