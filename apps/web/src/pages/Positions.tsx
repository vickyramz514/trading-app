import { useEffect, useState } from 'react'
import { positionsApi } from '../services/api'
import { Card } from '../components/Card'
import { DataTable } from '../components/DataTable'

interface Position {
  tradingsymbol?: string
  quantity?: number
  pnl?: number
  [key: string]: unknown
}

function normalizePositions(data: unknown): Position[] {
  if (!data || typeof data !== 'object') return []
  const d = data as Record<string, unknown>
  const list = (d.data as Position[]) ?? (d.positions as Position[]) ?? []
  return Array.isArray(list) ? list : []
}

export function Positions() {
  const [data, setData] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    positionsApi()
      .then((res) => setData(normalizePositions(res.data)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'tradingsymbol', header: 'Symbol' },
    { key: 'quantity', header: 'Qty' },
    {
      key: 'pnl',
      header: 'P&L',
      render: (r: Position) =>
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
      <h1 className="text-2xl font-bold text-slate-800">Positions</h1>
      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          {error}
        </div>
      )}
      <Card title="Open Positions">
        <DataTable columns={columns} data={data} isLoading={loading} />
      </Card>
    </div>
  )
}
