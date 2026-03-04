import { Router } from 'express'
import { getQuote } from '../controllers/MarketController.js'

const router = Router()

router.get('/quote', getQuote)

export default router
