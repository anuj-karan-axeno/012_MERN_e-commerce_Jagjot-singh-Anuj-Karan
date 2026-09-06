import express from 'express'
import { addToCart, decreaseCartItemQuantity, fetchCart, increaseCartItemQuantity } from './cart.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, fetchCart)
cartRouter.post('/', authMiddleware, addToCart)
cartRouter.patch('/item/:itemId/increase', authMiddleware, increaseCartItemQuantity)
cartRouter.patch('/item/:itemId/decrease', authMiddleware, decreaseCartItemQuantity)