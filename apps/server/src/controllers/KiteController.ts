import type { Request, Response } from 'express'
import { config } from '../config/index.js'
import { getKiteUserData } from '../services/KiteTokenStore.js'
import {
  exchangeRequestToken,
  kiteLogout,
} from '../services/ZerodhaBrokerService.js'
import { setKiteToken, clearKiteToken } from '../services/KiteTokenStore.js'

export function getStatus(_req: Request, res: Response) {
  const userData = getKiteUserData()
  const connected = !!userData
  res.json({
    success: true,
    connected,
    configured: !!config.zerodha.apiKey,
    user_name: userData?.user_name,
  })
}

export function getLoginUrl(_req: Request, res: Response) {
  if (!config.zerodha.apiKey) {
    return res.status(400).json({
      success: false,
      error: 'KITE_API_KEY not configured. Add it to server .env',
    })
  }
  const url = `${config.zerodha.loginUrl}?v=3&api_key=${config.zerodha.apiKey}`
  res.json({ success: true, loginUrl: url })
}

export async function handleCallback(req: Request, res: Response) {
  const requestToken = req.query.request_token as string
  const status = req.query.status as string

  if (!requestToken) {
    return res.redirect(`${getFrontendOrigin()}/?error=missing_token`)
  }
  if (status === 'failure') {
    return res.redirect(`${getFrontendOrigin()}/?error=login_failed`)
  }

  const result = await exchangeRequestToken(requestToken)
  if (!result.success || !result.data?.access_token) {
    return res.redirect(`${getFrontendOrigin()}/?error=${encodeURIComponent(result.error ?? 'token_exchange_failed')}`)
  }

  const accessToken = result.data.access_token as string
  setKiteToken(accessToken, result.data)

  res.redirect(`${getFrontendOrigin()}/?kite_login=success`)
}

export async function exchangeToken(req: Request, res: Response) {
  const { request_token } = req.body as { request_token?: string }
  if (!request_token || typeof request_token !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'request_token is required in request body',
    })
  }

  const result = await exchangeRequestToken(request_token)
  if (!result.success || !result.data?.access_token) {
    return res.status(400).json({
      success: false,
      error: result.error ?? 'Token exchange failed',
    })
  }

  const accessToken = result.data.access_token as string
  setKiteToken(accessToken, result.data)

  res.json({
    success: true,
    message: 'Zerodha connected',
    user_name: result.data.user_name,
  })
}

export async function logout(_req: Request, res: Response) {
  await kiteLogout()
  clearKiteToken()
  res.json({ success: true, message: 'Logged out from Zerodha' })
}

function getFrontendOrigin(): string {
  return process.env.FRONTEND_URL ?? 'http://localhost:5173'
}
