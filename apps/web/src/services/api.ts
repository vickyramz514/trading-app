import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3002'

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const profileApi = () => api.get('/profile')
export const holdingsApi = () => api.get('/holdings')
export const positionsApi = () => api.get('/positions')
export const quoteApi = (symbol: string) => api.get('/quote', { params: { symbol } })

export const kiteStatusApi = () => api.get('/kite/status')
export const kiteLoginApi = () => api.get('/kite/login')
export const kiteLogoutApi = () => api.post('/kite/logout')
