import { fileURLToPath } from "url";
import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import createInvoice from "../../utils/pdfinvoice.js";
import path from "path";
import cloudinary from "../../utils/cloud.js";
import { sendEmail } from "../../utils/sendEmails.js";
import { clearCart, updateStock } from "./order.service.js";



const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createOrder = asyncHandler(async (req, res, next) => {
  const { payment, address, coupon, phone } = req.body;

  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now(), }
    })
  }

  if (!checkCoupon) {
    return next(new Error("Invalid Coupon", { cause: 400 }))
  }


  const cart = await Cart.findOne({ user: req.user._id });
  const products = cart.products;
  if (products.length < 1) {
    return next(new Error("Empty cart"))
  }


  let orderProducts = [];
  let orderPrice = 0;


  for (let i = 0; i < products.lenght; i++) {

    const product = await Product.findById(products[i].productId)

    if (!product) return next(new Error(`${products[i].productId} product not found`));

    if (!product.inStock(products[i].quantity)) {
      return next(new Error(`prodout out stock, ${product.availableItems} are avaliable`))
    }


    orderProducts.push({
      name: product.name,
      quantitiy: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
      productId: product._id
    });


    orderPrice += product.finalPrice * products[i].quantity
  }

  const order = await Order.create({
    user: req.user._id,
    address,
    phone,
    payment,
    products: orderProducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount
    }
  })

  const user = req.user;


  const pdfpath = path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`);


  const invoice = {
    shipping: {
      name: req.user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id
  };
  createInvoice(invoice, pdfpath);



  const { secure_url, public_id } =
    await cloudinary.uploader.upload(pdfpath, { folder: `${process.env.CLOUD_FOLDER_NAME}/order/invoices` });


  order.invoice = { url: secure_url, id: public_id };
  await order.save();


  const isSend = await sendEmail({
    to: user.email,
    subject: "Order voice",
    attachments: [{ path: secure_url, contentType: "application/pdf" }]
  })

  if (!isSend) return next(new Error("something went wrong"))

  updateStock(order.products, true)

  clearCart(user._id)




  res.json({ success: true, results: { order } })

});



export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new Error("invalid order id ", { cause: 400 }));


  if (order.status === "dileverd" || order.status === "shipped" || order.status === "cancel") {
    return next(new Error("Can not cancel the order"))
  }


  order.status = "cancel"
  await order.save();

  updateStock(order.products, false)
  res.json({ success: true, message: "order cancelled successfully" })
})


