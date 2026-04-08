import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Customer } from '../types'

const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum']

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTier, setEditTier] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    api.getCustomers({ tier: tier || undefined, search: search || undefined })
      .then(setCustomers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      load()
    })
    return () => cancelAnimationFrame(id)
  }, [tier])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load() }

  const saveEdit = async (id: number) => {
    await api.updateCustomer(id, { customer_tier: editTier })
    setEditingId(null)
    load()
  }

  return (
    <div className="page">
      <div className="toolbar">
        <form onSubmit={handleSearch}>
          <input
            placeholder="Search name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <select value={tier} onChange={e => setTier(e.target.value)}>
          <option value="">All Tiers</option>
          {TIERS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
              <th>Registered</th><th>Tier</th><th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.customer_id}>
                <td>{c.customer_id}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.registration_date?.slice(0, 10)}</td>
                <td>
                  {editingId === c.customer_id ? (
                    <select value={editTier} onChange={e => setEditTier(e.target.value)}>
                      {TIERS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  ) : (
                    <span className={`badge tier-${c.customer_tier?.toLowerCase()}`}>
                      {c.customer_tier}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === c.customer_id ? (
                    <>
                      <button type="button" onClick={() => saveEdit(c.customer_id)}>Save</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => { setEditingId(c.customer_id); setEditTier(c.customer_tier) }}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      <p className="count">{customers.length} records</p>
    </div>
  )
}
