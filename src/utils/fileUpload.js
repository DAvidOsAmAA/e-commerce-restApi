import multer, { disStorage } from "multer"



export const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    if (!["image/png,image/jpeg"].includes(file.mimetype))
      return cb(new Error("invalid format"), false);


    return cb(null, true)
  }



  return multer({ storage: disStorage({}), fileFilter })
}