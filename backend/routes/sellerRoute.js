import express from 'express';
import { sellerLogin } from '../controllers/sellerController.js';
import { isSellerAuth } from '../controllers/sellerController.js';
import { sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router()

sellerRouter.post('/login', sellerLogin)
sellerRouter.get('/is-auth', authSeller, isSellerAuth)
sellerRouter.get('/logout', authSeller, sellerLogout)

export default sellerRouter;