const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const organizations = require('./../controllers/organizations')

module.exports = router

router
  .route('/')
  .get(organizations.getAll)

router
  // .all(verifyJWT)
  .route('/:org_id')
  .get(
    // checkJWTScopes(['read:organizations'], options),
    organizations.getByID
  )
  .patch(
    // checkJWTScopes(['update:organizations'], options),
    schemaValidator(organizations.schema.update),
    organizations.update
  )

router
  // .all(verifyJWT)
  .route('/:org_id/members')
  .get(
    // checkJWTScopes(['read:organization_members'], options),
    organizations.getMembers
  )
