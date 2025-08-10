import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController';
import authSeller from '../middlewares/authSeller';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.post('/is-auth', authSeller ,isSellerAuth);
sellerRouter.post('/logout', sellerLogout);


export default sellerRouter;