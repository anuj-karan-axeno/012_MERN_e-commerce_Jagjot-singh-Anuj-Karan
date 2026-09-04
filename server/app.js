import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authRoutes } from './src/modules/auth/auth.routes.js';
import { userRoutes } from './src/modules/user/user.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config({
    quiet: true
});
const app = express();

app.use(cookieParser())
app.use(express.json());


app.use('/v1/auth', authRoutes)
app.use('/v1/user', userRoutes)

app.get('/v1/health', (req, res) => {
    res.status(200).send({
        msg: "Server is healthy :)"
    })
})

const port = process.env.PORT;


mongoose.connect(process.env.MONGO_URL, {
    dbName: "ShopCo",
}).then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((err) => console.log(err));
