import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { profileApi, holdingsApi, kiteStatusApi, kiteLoginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/Card'

interface ProfileData {
  data?: { user_name?: string; [key: string]: unknown }
}

interface HoldingsData {
  data?: {
    total?: number
    total_investment?: number
    net?: number
    [key: string]: unknown
  }
}

interface KiteStatus {
  connected: boolean
  configured: boolean
  user_name?: string
}

export function Dashboard() {
  const { user: authUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [holdings, setHoldings] = useState<HoldingsData | null>(null)
  const [kiteStatus, setKiteStatus] = useState<KiteStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [kiteConnecting, setKiteConnecting] = useState(false)

  useEffect(() => {
    const kiteLogin = searchParams.get('kite_login')
    const kiteError = searchParams.get('error')
    if (kiteLogin || kiteError) {
      setSearchParams({}, { replace: true })
      if (kiteError) setError(decodeURIComponent(kiteError))
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profileRes, holdingsRes, statusRes] = await Promise.all([
          profileApi(),
          holdingsApi(),
          kiteStatusApi().catch(() => ({ data: { connected: false, configured: false } })),
        ])
        setKiteStatus((statusRes as { data: KiteStatus })?.data ?? null)
        const pr = profileRes.data as ProfileData & { success?: boolean }
        const hr = holdingsRes.data as HoldingsData & { success?: boolean }
        if (pr?.success === false || hr?.success === false) {
          setError('Broker not configured. Set BROKER_BASE_URL in server .env')
        } else {
          setProfile(pr)
          setHoldings(hr)
        }
      } catch (err) {
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? 'Backend not reachable. Start the server with: pnpm dev'
            : err instanceof Error
              ? err.message
              : 'Failed to load data'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-600">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
        Loading...
      </div>
    )
  }

  const profileName = String(
    (profile?.data as { user_name?: string })?.user_name ??
    (profile?.data as Record<string, unknown>)?.user_name ??
    'User'
  )

  if (error && !profile) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
          <strong>Note:</strong> {error}
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Profile">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {authUser ?? '—'}
            </p>
          </Card>
          <Card title="Portfolio Value">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600">—</p>
          </Card>
        </div>
      </div>
    )
  }

  const holdingsList = Array.isArray(holdings?.data)
    ? (holdings.data as Array<{ quantity?: number; last_price?: number; average_price?: number }>)
    : []
  const totalValue = holdingsList.length
    ? holdingsList.reduce(
        (sum, h) => sum + (Number(h.quantity) ?? 0) * (Number(h.last_price) ?? Number(h.average_price) ?? 0),
        0
      )
    : (holdings?.data as { net?: number })?.net ??
      (holdings?.data as { total?: number })?.total ??
      (holdings?.data as { total_investment?: number })?.total_investment ??
      '-'

  const handleConnectZerodha = async () => {
    setKiteConnecting(true)
    try {
      const res = await kiteLoginApi()
      const url = (res.data as { loginUrl?: string })?.loginUrl
      if (url) window.location.href = url
      else setError('Login URL not available')
    } catch {
      setError('Failed to get Zerodha login URL')
    } finally {
      setKiteConnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
          <strong>Note:</strong> {error}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        {kiteStatus?.configured && !kiteStatus?.connected && (
          <button
            onClick={handleConnectZerodha}
            disabled={kiteConnecting}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:opacity-50"
          >
            {kiteConnecting ? 'Redirecting...' : 'Connect Zerodha'}
          </button>
        )}
        {kiteStatus?.connected && (
          <span className="rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800">
            Zerodha: {kiteStatus.user_name ?? 'Connected'}
          </span>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Profile">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">{profileName}</p>
        </Card>
        <Card title="Portfolio Value">
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">
            {typeof totalValue === 'number' ? `₹${totalValue.toLocaleString()}` : totalValue}
          </p>
        </Card>
      </div>
    </div>
  )
}
