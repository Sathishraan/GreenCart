import express from 'express';
import { upload } from '../config/multer.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';
import authAdmin from '../middleware/authAdmin.js';


const productRouter = express.Router();

productRouter.post('/add', upload.array('images'), addProduct); 
productRouter.get('/list', productList); 
productRouter.get('/id', productById);
productRouter.post('/stock', authAdmin, changeStock);

export default productRouter;
