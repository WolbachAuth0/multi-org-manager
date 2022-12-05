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

/**
  This endpoint has to be here to redirect invitation links to the signup screen.
  
  http://localhost:8081/api/login?invitation=W6yRtawKU1wmi9vY9Y0GbjGSpEQErLvq&organization=org_poSk5O5ljabdHiKV&organization_name=okta
*/
router
  .route('/login')
  .get((req, res) => {
    const query = Object.assign(req.query, {
      response_type: 'code',
      client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
      redirect_uri: `${process.env.VUE_APP_DOMAIN}/profile`,
      response_mode: 'query'
    })
    const qs = new URLSearchParams(query).toString()
    const to = `https://${process.env.VUE_APP_CUSTOM_DOMAIN}/authorize?${qs}`
    res.redirect(to)
  })
