import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";

export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucher_codes.generate({ length: 5 });

  const coupon = await Coupon.create({
    name: code[0],
    createdBy: req.user._id,
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(),
  });

  res.json({ success: true, results: { coupon } });
});

export const updateCopoun = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });

  if (!coupon) return next(new Error("invalid coupon", { cause: 404 }));

  if (req.user.id.toString() != coupon.createdBy.toString()) {
    return next(new Error("not athorized", { cause: 403 }));
  }

  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt)
    : coupon.expiredAt;

  await coupon.save();

  res.json({ success: true, message: "coupon updated successfully" });
});

export const deleteCoppun = asyncHandler(async (req, res, next) => {

  const coupon = await Coupon.findOne({ name: req.params.code });

  if (!coupon) return next(new Error("Invalid copoun", { cause: 404 }));

  if (req.user._id.toString() != coupon.createdBy.toString()) {
    return next(new Error("Not Authorized", { cause: 403 }))
  }

  await coupon.deleteOne();

  res.json({ success: true, message: "coupone deleted successfully" })
});


export const allCoupons = asyncHandler(async (req, res, next) => {

if(req.user.role === "admin"){
  const copouns = await Coupon.find();
  return res.json({success:true,result:{copouns}})
}

if(req.user.role === "seller"){
  const copouns = await Coupon.find({createdBy:req.user._id});
  return res.json({success:true,result:{copouns}})
}

})