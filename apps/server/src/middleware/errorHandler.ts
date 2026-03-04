import type { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode ?? 500
  const message = err.message ?? 'Internal server error'

  console.error(`[Error] ${statusCode}: ${message}`, err.stack)

  res.status(statusCode).json({
    success: false,
    error: message,
  })
}
