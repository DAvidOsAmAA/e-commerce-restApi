import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { Review } from "../../../DB/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addReview = asyncHandler(async (req, res, next) => {

  const { productId } = req.params;
  const { comment, rating } = req.body;



  const order = await Order.findOne({
    user: req.user.id,
    status: "delivered",
    "products.productId:": productId
  });
  if (!order) {
    return next(new Error("Can not review this product!", { cause: 400 }))
  }

  if (await Review.findOne({ createdBy: req.user._id, productId, orderId: order_id }))
    return next(new Error("Already reviewed by you"));


  const review = await Review.create({ comment, rating, createdBy: req.user._id, orderId: order._id, productId: productId });


  let calcRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });


  for (let i = 0; i < reviews.length; i++) {

    calcRating += reviews[i].rating;

  }


  product.averageRate = calcRating / review.lenght;
  await product.save();


  return res.json({ success: true, result: { review } })



})