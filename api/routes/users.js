const router = require('express').Router()
const { verifyJWT, checkJWTScopes, checkJWTPermissions } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const users = require('./../controllers/users')

module.exports = router

function checkJWTUserID (req, res, next) {
  const customScopeKey = 'sub'
  const failWithError = true
  const orgIDs = [ req.params.user_id ]
  return checkJWTScopes(orgIDs, { customScopeKey, failWithError })(req, res, next)
}

// Organizations
router
  .route('/:user_id')
  .all(verifyJWT)
  .all(checkJWTUserID)
  .get(
    checkJWTPermissions(['read:user_profile']),
    users.getById
  )
  .patch(
    checkJWTPermissions(['update:user_profile']),
    // schemaValidator(),
    users.updateProfile
  )