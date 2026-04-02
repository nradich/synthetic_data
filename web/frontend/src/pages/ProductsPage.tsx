import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Product } from '../types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  const load = (cat = category, q = search) => {
    setLoading(true)
    setError(null)
    api.getProducts({ category: cat || undefined, search: q || undefined })
      .then(data => {
        setProducts(data)
        if (categories.length === 0) {
          const unique = [...new Set(data.map(p => p.category))].sort()
          setCategories(unique)
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [category])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(category, search) }

  return (
    <div className="page">
      <h2>Products</h2>
      <div className="toolbar">
        <form onSubmit={handleSearch}>
          <input
            placeholder="Search name or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Brand</th><th>Category</th>
              <th>Price</th><th>Stock</th><th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>{p.product_name}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.stock_quantity}</td>
                <td>{p.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="count">{products.length} records</p>
    </div>
  )
}
