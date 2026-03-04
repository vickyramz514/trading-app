import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { brokerService } from '../services/BrokerService.js'
import { getKiteProfile } from '../services/ZerodhaBrokerService.js'
import { getKiteToken, getKiteUserData } from '../services/KiteTokenStore.js'
import type { Request, Response } from 'express'

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (config.zerodha.apiKey && getKiteToken()) {
      const result = await getKiteProfile()
      if (result && 'status' in result && result.status === 'error') {
        return res.status(401).json({ success: false, error: result.message })
      }
      return res.json({ success: true, data: result })
    }
    const cached = getKiteUserData()
    if (cached) {
      return res.json({
        success: true,
        data: {
          user_name: cached.user_name,
          email: cached.email,
          user_id: cached.user_id,
        },
      })
    }
    const result = await brokerService.get<Record<string, unknown>>(
      config.broker.paths.profile
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
