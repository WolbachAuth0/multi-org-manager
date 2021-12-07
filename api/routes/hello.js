const router = require('express').Router()
const responseFormatter = require('./../middleware/responseFormatter')

module.exports = router

router
  .route('/hello')
  .get((req, res) => {
    try {
      const status = 200
      const message = 'Hello from the API server !'
      const data = {
        isAuthenticated: req.oidc.isAuthenticated(),
        identity: req.oidc.user,
        claims: req.oidc.idTokenClaims
      }
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    } catch (error) {
      const status = 500
      const message = error.message
      const data = error
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    }
  })
