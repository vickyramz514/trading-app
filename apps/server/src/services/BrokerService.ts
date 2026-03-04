import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { config } from '../config/index.js'

export interface BrokerApiError {
  success: false
  error: string
  statusCode?: number
}

export class BrokerService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.broker.baseUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.broker.accessToken}`,
        ...(config.broker.apiKey && {
          [config.broker.apiKeyHeader]: config.broker.apiKey,
        }),
      },
    })
  }

  private handleError(error: unknown): BrokerApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>
      const message =
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error ??
        axiosError.message ??
        'Broker API request failed'
      const statusCode = axiosError.response?.status
      return { success: false, error: message, statusCode }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T | BrokerApiError> {
    if (!config.broker.baseUrl) {
      return this.getMockData(path, params) as T
    }
    try {
      const response = await this.client.get<T>(path, { params })
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  private getMockData(
    path: string,
    params?: Record<string, string>
  ): Record<string, unknown> | unknown[] {
    const p = config.broker.paths
    if (path === p.profile) return { user_name: 'Demo User' }
    if (path === p.holdings || path === p.positions) return []
    if (path === p.quote) {
      const symbol = params?.symbol ?? 'N/A'
      return { symbol, ltp: 0, name: `Quote for ${symbol}` }
    }
    return {}
  }
}

export const brokerService = new BrokerService()
