const responseFormatter = require('./responseFormatter')
const Validator = require('jsonschema').Validator
const validator = new Validator()

module.exports = function (schema) {

  return function (req, res, next) {
    // console.log('validating request body ...')
    const validation = validator.validate(req.body, schema)
    if (validation.valid) {
      next()
    } else {
      const status = 400
      const message = 'Request body does not match schema'
      const data = validation
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    }
  }
}

