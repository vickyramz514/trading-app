import { brokerService } from '../services/BrokerService.js'
import { config } from '../config/index.js'
import {
  getKiteHoldings,
  getKitePositions,
} from '../services/ZerodhaBrokerService.js'
import { getKiteToken } from '../services/KiteTokenStore.js'
import type { Request, Response } from 'express'

export const getHoldings = async (_req: Request, res: Response) => {
  try {
    if (config.zerodha.apiKey && getKiteToken()) {
      const result = await getKiteHoldings()
      if (result && 'status' in result && result.status === 'error') {
        return res.status(401).json({ success: false, error: result.message })
      }
      return res.json({ success: true, data: result })
    }
    const result = await brokerService.get<unknown>(config.broker.paths.holdings)
    if (result && typeof result === 'object' && 'success' in result && !(result as { success: boolean }).success) {
      return res
        .status((result as { statusCode?: number }).statusCode ?? 500)
        .json(result)
    }
    res.json({ success: true, data: result ?? [] })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch holdings',
    })
  }
}

export const getPositions = async (_req: Request, res: Response) => {
  try {
    if (config.zerodha.apiKey && getKiteToken()) {
      const result = await getKitePositions()
      if (result && 'status' in result && result.status === 'error') {
        return res.status(401).json({ success: false, error: result.message })
      }
      return res.json({ success: true, data: result })
    }
    const result = await brokerService.get<unknown>(config.broker.paths.positions)
    if (result && typeof result === 'object' && 'success' in result && !(result as { success: boolean }).success) {
      return res
        .status((result as { statusCode?: number }).statusCode ?? 500)
        .json(result)
    }
    res.json({ success: true, data: result ?? [] })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch positions',
    })
  }
}
