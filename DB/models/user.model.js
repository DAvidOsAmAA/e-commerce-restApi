import { Schema, model } from "mongoose";

import bcryptjs from 'bcryptjs';

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 20
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ["female", "male"]
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user"
  },
  forgetCode: {
    type: String
  },
  profileImage: {
    url: { type: String, default: "https://res.cloudinary.com/da7u4yupa/image/upload/v1705453315/ecommerce/users/user-icon-trendy-flat-style-260nw-418179865_x9v5z1.webp" },
    id: { type: String, default: "ecommerce/users/user-icon-trendy-flat-style-260nw-418179865_x9v5z1" }
  },
  coverImage: [{ url: { type: String }, id: { type: String } }]

}, { timestamps: true })


userSchema.pre("save", function () {

  if(this.isModified("password")){
    this.password = bcryptjs.hashSync(this.password, parseInt(process.env.SALT_ROUND));
  }

})

export const User = model("User", userSchema)