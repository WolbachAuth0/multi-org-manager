const { auth, requiresAuth } = require('express-openid-connect')
const checkJWTScopes = require('express-jwt-authz')
// const checkJWTScopes = require('./checkJWTScopes')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')   

// OIDC middleware
const oidcMiddleware = auth({
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL:  `https://${process.env.VUE_APP_CUSTOM_DOMAIN}`,
  baseURL: `${process.env.VUE_APP_DOMAIN}/`,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  secret: process.env.AUTH0_API_CLIENT_SECRET,
  idpLogout: true,
})

// JWT checker
const verifyJWT = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.VUE_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.VUE_APP_CUSTOM_DOMAIN}/`,
  algorithms: ['RS256']
})

function checkJWTPermissions (permissions) {
  const customScopeKey = 'permissions'
  const failWithError = true
  return checkJWTScopes(permissions, { customScopeKey, failWithError })
}

module.exports = {
  oidcMiddleware,
  verifyJWT,
  requiresAuth,
  checkJWTScopes,
  checkJWTPermissions
}