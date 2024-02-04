const { json } = require("express")
const { CustomAPIError } = require("../errors/custom-Error")

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  } else if (err.name === "CastError") {
    return res.status(400), json({ msg: "malformatted ID" })
  }
  return res.status(500).json({ msg: "Something went wrong, please try again" })
}

module.exports = errorHandler
