import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'
import { api } from '../api'
import { formatMoney, parseMoney } from '../money'
import { useTheme } from '../ThemeContext'
import type { Customer, Order, Product } from '../types'

const STATUS_COLORS: Record<string, string> = {
  Pending: '#fbbf24',
  Processing: '#60a5fa',
  Shipped: '#34d399',
  Delivered: '#94a3b8',
  Cancelled: '#f87171',
}

export default function DashboardPage() {
  const { theme } = useTheme()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const chartUi = useMemo(
    () =>
      theme === 'dark'
        ? {
            axis: '#94a3b8',
            grid: '#334155',
            tooltipBg: '#243144',
            tooltipBorder: '#475569',
            tooltipColor: '#f1f5f9',
          }
        : {
            axis: '#64748b',
            grid: '#e2e8f0',
            tooltipBg: '#ffffff',
            tooltipBorder: '#e2e8f0',
            tooltipColor: '#334155',
          },
    [theme],
  )

  useEffect(() => {
    Promise.all([api.getCustomers(), api.getProducts(), api.getOrders()])
      .then(([c, p, o]) => {
        setCustomers(c)
        setProducts(p)
        setOrders(o)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="loading">Loading dashboard...</p>

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }))

  const tierCounts = customers.reduce<Record<string, number>>((acc, c) => {
    acc[c.customer_tier] = (acc[c.customer_tier] ?? 0) + 1
    return acc
  }, {})

  const totalRevenue = orders.reduce((sum, o) => sum + parseMoney(o.total_amount), 0)
  const tierDenom = Math.max(customers.length, 1)

  return (
    <div className="dashboard">
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{customers.length.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{orders.length.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">{formatMoney(totalRevenue)}</span>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartUi.grid} vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: chartUi.axis }} />
              <YAxis tick={{ fontSize: 12, fill: chartUi.axis }} />
              <Tooltip
                contentStyle={{
                  fontSize: 13,
                  borderRadius: 8,
                  border: `1px solid ${chartUi.tooltipBorder}`,
                  background: chartUi.tooltipBg,
                  color: chartUi.tooltipColor,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map(entry => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Customer Tiers</h3>
          <div className="tier-breakdown">
            {Object.entries(tierCounts).map(([tier, count]) => (
              <div key={tier} className="tier-row">
                <span className={`badge tier-${tier.toLowerCase()}`}>{tier}</span>
                <span className="tier-count">{count.toLocaleString()}</span>
                <div className="tier-bar-bg">
                  <div
                    className="tier-bar-fill"
                    style={{
                      width: `${Math.round((count / tierDenom) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
