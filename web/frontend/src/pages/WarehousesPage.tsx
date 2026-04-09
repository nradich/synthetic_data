import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Warehouse } from '../types'

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api.getWarehouses()
      .then(data => {
        if (!cancelled) setWarehouses(data)
      })
      .catch(e => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="page">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>ZIP</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map(w => (
                <tr key={w.warehouse_id}>
                  <td>{w.warehouse_id}</td>
                  <td>{w.name}</td>
                  <td>{w.city}, {w.state}</td>
                  <td>{w.postal_code}</td>
                  <td>{w.latitude != null ? Number(w.latitude).toFixed(4) : '—'}</td>
                  <td>{w.longitude != null ? Number(w.longitude).toFixed(4) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="count">{warehouses.length} warehouses</p>
        </div>
      )}
    </div>
  )
}
