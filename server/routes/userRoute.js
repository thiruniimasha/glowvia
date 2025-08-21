import express from 'express';
import { isAuth, login, logout, register, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth',authUser, isAuth)
userRouter.get('/logout',authUser, logout)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);


export default userRouter