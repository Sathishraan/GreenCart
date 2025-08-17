import express from "express";
import { updateCart } from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js";

const cartRouter = express.Router();

cartRouter.post('/cartupdate', authUser, updateCart);

export default cartRouter;
 