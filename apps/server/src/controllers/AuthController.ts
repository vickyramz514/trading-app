import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { brokerService } from '../services/BrokerService.js'
import type { Request, Response } from 'express'

export const getProfile = async (req: Request, res: Response) => {
  try {
    const result = await brokerService.get<Record<string, unknown>>(config.broker.paths.profile)

    if (result && 'success' in result && !result.success) {
      return res.status((result as { statusCode?: number }).statusCode ?? 500).json(result)
    }

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
    })
  }
}

export const generateToken = (payload: Record<string, unknown>): string => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: '24h' })
}

export const verifyToken = (token: string): Record<string, unknown> | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Record<string, unknown>
    return decoded
  } catch {
    return null
  }
}
