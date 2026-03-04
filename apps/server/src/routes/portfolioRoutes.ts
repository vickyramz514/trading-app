import { Router } from 'express'
import { getHoldings, getPositions } from '../controllers/PortfolioController.js'

const router = Router()

router.get('/holdings', getHoldings)
router.get('/positions', getPositions)

export default router
