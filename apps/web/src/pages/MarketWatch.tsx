import { useState } from 'react'
import { quoteApi } from '../services/api'
import { Card } from '../components/Card'

interface QuoteData {
  [key: string]: unknown
}

function formatQuote(data: QuoteData): { label: string; value: string }[] {
  const entries: { label: string; value: string }[] = []
  const skip = ['success', 'data', 'depth']

  for (const [k, v] of Object.entries(data)) {
    if (skip.includes(k)) continue
    if (k === 'ohlc' && v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      ;['open', 'high', 'low', 'close'].forEach((f) => {
        if (o[f] != null) entries.push({ label: `OHLC.${f}`, value: String(o[f]) })
      })
    } else if (v != null && typeof v !== 'object') {
      entries.push({ label: k, value: String(v) })
    }
  }
  return entries
}

export function MarketWatch() {
  const [symbol, setSymbol] = useState('')
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol.trim()) return
    setLoading(true)
    setError(null)
    setQuote(null)
    try {
      const res = await quoteApi(symbol.trim())
      const d = res.data as Record<string, unknown>
      const q = (d.data as QuoteData) ?? d
      setQuote(typeof q === 'object' && q ? q : {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Market Watch</h1>
      <Card title="Quote Search">
        <form onSubmit={search} className="flex gap-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Symbol (e.g. RELIANCE)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </Card>
      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          {error}
        </div>
      )}
      {quote && Object.keys(quote).length > 0 && (
        <Card title={`Quote: ${symbol.toUpperCase()}`}>
          <dl className="grid gap-2 sm:grid-cols-2">
            {formatQuote(quote).map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-slate-100 py-2.5">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </div>
  )
}
