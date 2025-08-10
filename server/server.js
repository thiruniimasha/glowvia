import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';


const app = express();
const port = process.env.PORT || 4000;

await connectDB()

//allow multiple origins
const allowedOrigins = ['http://localhost:5173']

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
