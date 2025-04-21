import express from 'express'
import authUser from '../middlewares/authUser.js'
import { updateCart } from '../controllers/cartController.js'

const cartRouter = express.Router()

cartRouter.put('/update', authUser, updateCart)

export default cartRouter