import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose';
import { authRoutes } from './src/modules/auth/auth.routes.js';
import { userRoutes } from './src/modules/user/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { productRouter } from './src/modules/products/product.routes.js';
import { categoriesRouter } from './src/modules/categories/categories.routes.js';
import { cartRouter } from './src/modules/cart/cart.routes.js';
import { orderRouter } from './src/modules/order/order.routes.js';
import multer from 'multer';

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/category', categoriesRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/order', orderRouter)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit. Please upload images under 5MB.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ success: false, message: 'You can upload a maximum of 2 gallery images only.' });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
        return res.status(400).json({ success: false, message: err.message || 'An error occurred during file upload.' });
    }
    next();
});

app.get('/v1/health', (req, res) => {
    res.status(200).send({
        msg: "Server is healthy :)"
    })
})

const port = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_URL, {
    dbName: "ShopCo",
}).then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((err) => console.log(err));
