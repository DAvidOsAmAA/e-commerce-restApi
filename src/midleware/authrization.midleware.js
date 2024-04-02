export const isAuthorized = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      return next(new Error("Not Authorized",{cause:403}))
    }
    return next();
  }
}