import { Router } from 'express'
import {
  getStatus,
  getLoginUrl,
  handleCallback,
  exchangeToken,
  logout,
} from '../controllers/KiteController.js'

const router = Router()

router.get('/status', getStatus)
router.get('/login', getLoginUrl)
router.get('/callback', handleCallback)
router.post('/token', exchangeToken)
router.post('/logout', logout)

export default router
