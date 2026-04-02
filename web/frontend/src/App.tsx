import { useState } from 'react'
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import './App.css'

type Tab = 'customers' | 'products' | 'orders'

export default function App() {
  const [tab, setTab] = useState<Tab>('customers')

  return (
    <div className="app">
      <header>
        <h1>Synthetic Data Dashboard</h1>
        <nav>
          {(['customers', 'products', 'orders'] as Tab[]).map(t => (
            <button
              key={t}
              className={tab === t ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {tab === 'customers' && <CustomersPage />}
        {tab === 'products' && <ProductsPage />}
        {tab === 'orders' && <OrdersPage />}
      </main>
    </div>
  )
}
