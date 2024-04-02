import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './DB/connection.js';
import authRouter from './src/modules/auth/auth.router.js' 
import categoryRouter from './src/modules/category/category.router.js'
const app = express();
dotenv.config()
const port = 3000;
app.use(express.json())

await connectDB();

app.use("/auth", authRouter);
app.use("/category", categoryRouter);

app.all("*", (req, res, next) => {
  return next(new Error("page not found", { cause: 404 }))
})


app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({ success: false, message: error.message, stack: error.stack })
})

app.listen(port, () => {
 console.log(`App running on ${port}`)
})
