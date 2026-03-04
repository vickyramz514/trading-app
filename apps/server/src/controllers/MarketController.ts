import { brokerService } from '../services/BrokerService.js'
import { config } from '../config/index.js'
import { getKiteQuote } from '../services/ZerodhaBrokerService.js'
import { getKiteToken } from '../services/KiteTokenStore.js'
import type { Request, Response } from 'express'

export const getQuote = async (req: Request, res: Response) => {
  const symbol = (req.query.symbol as string)?.trim()
  if (!symbol) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "symbol" is required (e.g. ?symbol=RELIANCE)',
    })
  }

  try {
    if (config.zerodha.apiKey && getKiteToken()) {
      const result = await getKiteQuote(symbol)
      if (result && 'status' in result && result.status === 'error') {
        return res.status(401).json({ success: false, error: result.message })
      }
      return res.json({ success: true, data: result })
    }
    const result = await brokerService.get<Record<string, unknown>>(
      config.broker.paths.quote,
      { symbol: symbol.toUpperCase() }
    )
    if (result && 'success' in result && !result.success) {
      return res
        .status((result as { statusCode?: number }).statusCode ?? 500)
        .json(result)
    }
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch quote',
    })
  }
}
