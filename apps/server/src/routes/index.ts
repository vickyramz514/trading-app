import { Router } from 'express'
import authRoutes from './authRoutes.js'
import portfolioRoutes from './portfolioRoutes.js'
import marketRoutes from './marketRoutes.js'

const router = Router()

router.use(authRoutes)
router.use(portfolioRoutes)
router.use(marketRoutes)

export default router
