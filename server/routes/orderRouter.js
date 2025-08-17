import express from 'express';

import { getAllOrders, getUserOrders, placeOderCOD, placeOderStripe } from '../controllers/orderController.js';
import authUser from '../middleware/authUser.js';


const orderRouter = express.Router();


orderRouter.post('/cod',authUser, placeOderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/admin',  getAllOrders);
orderRouter.post('/stripe',authUser, placeOderStripe);

export default orderRouter;