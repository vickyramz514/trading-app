import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../controllers/AuthController.js'

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, unknown>
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }

  req.user = decoded
  next()
}
