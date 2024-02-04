const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method)
  console.log("path: ", request.path)
  console.log("Body: ", request.body)
  console.log("---")
  next()
}

module.exports = requestLogger
