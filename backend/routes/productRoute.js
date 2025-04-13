import express from 'express'
import { upload } from '../config/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeProductStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(['images']), authSeller, addProduct)
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, changeProductStock)

export default productRouter