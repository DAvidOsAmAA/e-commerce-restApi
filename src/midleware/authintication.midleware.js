import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers["token"];
  if (!token || !token.startsWith(process.env.BARER_KEY)) {
    return next(new Error("Valid token is required"));
  }
  token = token.split(process.env.BARER_KEY)[1];
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("Token is invalid"))

  const user = await User.findById(payload.id);
  if (!user) return next(new Error("user not found", { cause: 404 }))


  req.user = user;
  return next();

})