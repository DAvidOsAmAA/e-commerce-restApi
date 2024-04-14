import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmails.js";
import { Token } from "../../../DB/models/token.model.js";
import Randomstring from "randomstring";
import { Cart } from "../../../DB/models/cart.model.js";

export const register = async (req, res, next) => {
  const { email, userName, password, confirmedPassword } = req.body;

  const user = await User.findOne({ email });

  if (user) next(new Error("User already existed", { cause: 409 }));

  const token = jwt.sign({ email }, process.env.SECRET_KEY);

  await User.create({ ...req.body });

  const confirmedLink = `http://localhost:3000/auth/activate_account/${token}`;

  const messageSend = await sendEmail({
    to: email,
    subject: "Activate account",
    html: `<p>Click the following link to activate your account:</p><a href="${confirmedLink}">${confirmedLink}</a>`,
  });

  
  if (!messageSend)
    return next(new Error("Something went wrong sending the email"));
  return res.status(201).json({ success: true, message: "check you Email" });
};

export const ActivateAccount = async (req, res, next) => {
  const { token } = req.params;

  const { email } = jwt.verify(token, process.env.SECRET_KEY);

  const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });

  if (!user) next(new Error("User not found", { cause: 404 }));

  await Cart.create({ user: user._id });

  res.json({ success: true, message: "you can login now" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new Error("invalid email !!", { cause: 404 }));

  if (!user.isConfirmed)
    return next(new Error("you should activate your account"));

  const match = bcryptjs.compareSync(password, user.password);


  if (!match) return next(new Error("invalid password"));

  const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY);

  await Token.create({ token, user: user._id });


  return res.json({ success: true, result: { token } });
};

export const forgetCode = async (req, res, next) => {


  const { email } = req.body;


  const user = await User.findOne({ email });

  if (!user) return next(new Error("invalid email !!", { cause: 404 }));


  const forgetCode = Randomstring.generate({
    charset: "numeric",
    length: 5,
  });


  user.forgetCode = forgetCode;
  await user.save();


  const sendMessage = await sendEmail({
    to: email,
    subject: "reset password",
    html: `<p>your code is ${forgetCode}</p>`,
  });


  if (!sendMessage) return next(new Error("something went wrong "));
  return res.json({ success: true, message: "check your email" });
};

export const resetPassword = async (req, res, next) => {
  const { email, password, forgetCode } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("invalid email !!", { cause: 404 }));
  if (forgetCode !== user.forgetCode) return next(new Error("Code invalid"));
  const hashPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  await user.save();
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  return res.json({
    success: true,
    message: "try to login again with the new password",
  });
};
