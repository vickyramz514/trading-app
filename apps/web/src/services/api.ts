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
