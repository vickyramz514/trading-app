import { brokerService } from '../services/BrokerService.js'
import { config } from '../config/index.js'
import type { Request, Response } from 'express'

export const getHoldings = async (_req: Request, res: Response) => {
  try {
    const result = await brokerService.get<Record<string, unknown>>(config.broker.paths.holdings)

    if (result && 'success' in result && !result.success) {
      return res.status((result as { statusCode?: number }).statusCode ?? 500).json(result)
    }

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch holdings',
    })
  }
}

export const getPositions = async (_req: Request, res: Response) => {
  try {
    const result = await brokerService.get<Record<string, unknown>>(config.broker.paths.positions)

    if (result && 'success' in result && !result.success) {
      return res.status((result as { statusCode?: number }).statusCode ?? 500).json(result)
    }

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch positions',
    })
  }
}
