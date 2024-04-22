import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import subCategoryRouter from "./src/modules/subcategory/subcategory.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import couponRouter from './src/modules/coupon/coupon.router.js';
import productRouter from './src/modules/product/product.router.js';
import carttRouter from './src/modules/cart/cart.router.js'
import createInvoice from "./src/utils/pdfinvoice.js";
import orderRouter from "./src/modules/order/order.router.js"
import  reviewRouter from"./src/modules/reviews/review.router.js"
const app = express();
dotenv.config();
const port = 3000;
app.use(express.json());

await connectDB();

const invoice = {
  shipping: {
    name: "John david",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};



createInvoice(invoice,"invoice.pdf")

app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);
app.use("/product", productRouter);
app.use("/cart", carttRouter);
app.use("/order",orderRouter)
app.use("/review",reviewRouter)


app.all("*", (req, res, next) => {
  return next(new Error("page not found", { cause: 404 }));
});

app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res
    .status(statusCode)
    .json({ success: false, message: error.message, stack: error.stack });
});

app.listen(port, () => {
  console.log(`App running on ${port}`);
});
