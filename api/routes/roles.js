const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const roles = require('./../controllers/roles')

module.exports = router

const options = {
  customScopeKey: 'permissions',
  failWithError: true
}

router
  .route('/')
  .get(roles.list)

router.route('/:role_id')
  // .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organizations'], options),
    roles.getByID
  )

