import { useEffect, useState } from 'react'
import { holdingsApi } from '../services/api'
import { Card } from '../components/Card'
import { DataTable } from '../components/DataTable'

interface Holding {
  tradingsymbol?: string
  quantity?: number
  average_price?: number
  pnl?: number
  [key: string]: unknown
}

function normalizeHoldings(data: unknown): Holding[] {
  if (!data || typeof data !== 'object') return []
  const d = data as Record<string, unknown>
  const list = (d.data as Holding[]) ?? (d.holdings as Holding[]) ?? []
  return Array.isArray(list) ? list : []
}

export function Holdings() {
  const [data, setData] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    holdingsApi()
      .then((res) => setData(normalizeHoldings(res.data)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'tradingsymbol', header: 'Symbol' },
    { key: 'quantity', header: 'Qty' },
    {
      key: 'average_price',
      header: 'Avg Price',
      render: (r: Holding) =>
        r.average_price != null ? `₹${Number(r.average_price).toFixed(2)}` : '-',
    },
    {
      key: 'pnl',
      header: 'P&L',
      render: (r: Holding) =>
        r.pnl != null ? (
          <span className={Number(r.pnl) >= 0 ? 'font-medium text-emerald-600' : 'font-medium text-red-600'}>
            ₹{Number(r.pnl).toFixed(2)}
          </span>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Holdings</h1>
      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          {error}
        </div>
      )}
      <Card title="Holdings">
        <DataTable columns={columns} data={data} isLoading={loading} />
      </Card>
    </div>
  )
}
