import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";




export const addToCart = asyncHandler(async (req, res, next) => {

  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found"))


  if (quantity > product.availableItems) {


    return next(new Error(`sorry, only ${product.availableItems} items is availabe `))

  }






  const cart = await Cart.findOneAndUpdate(

    {
      user: req.user._id
    },

    { $push: { products: { productId, quantity } } },
    {
      new: true
    }

  );


  return res.json({ success: true, results: { cart } })
})


export const userCart = asyncHandler(async (req, res, next) => {

  if (req.user.role) {
    const cart = await Cart.findOne({ user: req.user._id })

    return res.json({ success: true, results: { cart } })

  }
  if (req.user.role == "admin" && !req.body.cart) {

    return next(new Error("Cart id is required"))

  }



  const carts = await Cart.findById(req.body.cartId);

  return res.json({ success: true, result: { carts } })

});



{/*export const updateCart = asyncHandler(async (req, res, next) => {


  const { productId, quantity } = req.body;


  const cart = await Cart.findByIdAndUpdate({
    use: req.user._id, "products.productId": productId,
  }, { "products.$.quantity": quantity },
    { new: true });



  return res.json({ success: true, result: { cart } })

})*/}


export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found"))

  if (quantity > product.availableItems) {


    return next(new Error(`sorry, only ${product.availableItems} items is availabe `))

  }

  if (!productId || !quantity) {
    return res.status(400).json({ success: false, message: "productId and quantity are required" });
  }


  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ success: false, message: "Product not found in cart" });
  }


  return res.json({ success: true, result: { cart } });
});







export const removeFromCart = asyncHandler(async (req, res, next) => {


  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found"))


  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }

  )

  res.json({ success: true, results: { cart } })

})
