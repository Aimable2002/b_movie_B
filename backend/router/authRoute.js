import express from 'express'
import { login, signup, verifyRoute } from '../controller/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/sign', signup)
router.post('/verify', verifyRoute)

export default router
