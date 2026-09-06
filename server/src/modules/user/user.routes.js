import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getUserInfo } from './user.controller.js';

export const userRoutes = express.Router();

userRoutes.get('/', authMiddleware, getUserInfo)