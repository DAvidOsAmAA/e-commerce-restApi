export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query }
    const validation = schema.validate(data, { abortEarly: false })
    if(validation.error){
      const errorMessage = validation.error.details.map(
        (errorObj) => errorObj.message
      )
      return next(new Error(errorMessage, {cause:400}))
    }
    return next();
  }
}