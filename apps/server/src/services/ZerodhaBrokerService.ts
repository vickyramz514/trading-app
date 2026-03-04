import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { createHash } from 'crypto'
import { config } from '../config/index.js'
import { getKiteToken } from './KiteTokenStore.js'

const KITE_BASE = config.zerodha.baseUrl

export interface KiteApiError {
  status: 'error'
  message?: string
  error_type?: string
}

function createClient(accessToken: string): AxiosInstance {
  return axios.create({
    baseURL: KITE_BASE,
    timeout: 15000,
    headers: {
      'X-Kite-Version': '3',
      Authorization: `token ${config.zerodha.apiKey}:${accessToken}`,
    },
  })
}

export async function exchangeRequestToken(requestToken: string): Promise<{
  success: boolean
  data?: Record<string, unknown>
  error?: string
}> {
  const checksum = createHash('sha256')
    .update(config.zerodha.apiKey + requestToken + config.zerodha.apiSecret)
    .digest('hex')

  try {
    const res = await axios.post(
      `${KITE_BASE}/session/token`,
      new URLSearchParams({
        api_key: config.zerodha.apiKey,
        request_token: requestToken,
        checksum,
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    const body = res.data as { status: string; data?: Record<string, unknown> }
    if (body.status === 'success' && body.data?.access_token) {
      return { success: true, data: body.data }
    }
    return { success: false, error: 'Invalid response from Zerodha' }
  } catch (err) {
    const msg =
      axios.isAxiosError(err) && err.response?.data
        ? (err.response.data as { message?: string }).message ?? err.message
        : err instanceof Error
          ? err.message
          : 'Token exchange failed'
    return { success: false, error: msg }
  }
}

export async function kiteLogout(): Promise<boolean> {
  const token = getKiteToken()
  if (!token) return true
  try {
    await axios.delete(
      `${KITE_BASE}/session/token?api_key=${config.zerodha.apiKey}&access_token=${token}`,
      { headers: { 'X-Kite-Version': '3' } }
    )
    return true
  } catch {
    return false
  }
}

async function kiteGet<T>(
  path: string,
  params?: Record<string, string | string[]>
): Promise<T | KiteApiError> {
  const token = getKiteToken()
  if (!token) {
    return { status: 'error', message: 'Not logged in. Complete Zerodha login first.' }
  }

  try {
    const client = createClient(token)
    const response = await client.get<T>(path, { params })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ message?: string }>
      const msg = err.response?.data?.message ?? err.message ?? 'API request failed'
      return { status: 'error', message: msg }
    }
    return { status: 'error', message: 'Unknown error' }
  }
}

export async function getKiteProfile(): Promise<Record<string, unknown> | KiteApiError> {
  const result = await kiteGet<{ status: string; data: Record<string, unknown> }>('/user/profile')
  if (result && 'status' in result && result.status === 'error') {
    return result
  }
  const r = result as { status: string; data: Record<string, unknown> }
  return r?.data ?? {}
}

export async function getKiteHoldings(): Promise<unknown[] | KiteApiError> {
  const result = await kiteGet<{ status: string; data: unknown[] }>('/portfolio/holdings')
  if (result && 'status' in result && (result as KiteApiError).status === 'error') {
    return result as KiteApiError
  }
  const r = result as { status: string; data: unknown[] }
  return (Array.isArray(r?.data) ? r.data : []) as unknown[]
}

export async function getKitePositions(): Promise<unknown[] | KiteApiError> {
  const result = await kiteGet<{ status: string; data: { net: unknown[] } }>('/portfolio/positions')
  if (result && 'status' in result && (result as KiteApiError).status === 'error') {
    return result as KiteApiError
  }
  const r = result as { status: string; data: { net: unknown[] } }
  const net = r?.data?.net
  return (Array.isArray(net) ? net : []) as unknown[]
}

export async function getKiteQuote(
  symbol: string
): Promise<Record<string, unknown> | KiteApiError> {
  const key = `NSE:${symbol.toUpperCase()}`
  const result = await kiteGet<{ status: string; data: Record<string, unknown> }>('/quote', {
    i: [key],
  })
  if (result && 'status' in result && result.status === 'error') {
    return result
  }
  const r = result as { status: string; data: Record<string, unknown> }
  const data = r?.data ?? {}
  const quote = data[key]
  return (quote as Record<string, unknown>) ?? {}
}
