import express from 'express';
import { adminLogin, adminlogout, isAdminAuth } from '../controllers/adminController.js';




const adminRouter = express.Router();


adminRouter.post('/login', adminLogin);
adminRouter.get('/is-auth',isAdminAuth );
adminRouter.get('/admin-logout', adminlogout );

export default adminRouter;