import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/db.js';
import { stripeWebhooks } from './controllers/orderController.js';
import addressRouter from './routes/addressRouter.js';
import adminRouter from './routes/adminRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const app = express();

await connectDB();
await connectCloudinary();

// ✅ CRITICAL: Set up CORS and cookie parser first
app.use(cors({
    origin: 'https://green-cart-three-flame.vercel.app/',
    credentials: true
}));

app.use(cookieParser());

// ✅ CRITICAL: Add Stripe webhook route BEFORE express.json() middleware
// This ensures req.body remains a raw buffer for signature verification
app.post(
    '/stripewebhooks',
    express.raw({ type: 'application/json' }), // Keeps body as raw buffer
    stripeWebhooks
);

// ✅ IMPORTANT: Add JSON parsing middleware AFTER the webhook route
// This way other routes get parsed JSON, but webhook gets raw buffer
app.use(express.json());

const port = process.env.PORT || 2003;

app.get('/', (req, res) => {
    res.send("API is working")
});

// All other routes (these will have parsed JSON bodies)
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
    console.log(`Server is running successfully ${port}`);
});