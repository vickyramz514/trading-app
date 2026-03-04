import { brokerService } from '../services/BrokerService.js'
import { config } from '../config/index.js'
import type { Request, Response } from 'express'

export const getQuote = async (req: Request, res: Response) => {
  const symbol = req.query.symbol as string

  if (!symbol) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "symbol" is required (e.g. ?symbol=RELIANCE)',
    })
  }

  try {
    const result = await brokerService.get<Record<string, unknown>>(config.broker.paths.quote, {
      symbol: symbol.toUpperCase(),
    })

    if (result && 'success' in result && !result.success) {
      return res.status((result as { statusCode?: number }).statusCode ?? 500).json(result)
    }

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch quote',
    })
  }
}
