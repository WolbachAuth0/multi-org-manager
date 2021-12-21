const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const organizations = require('./../controllers/organizations')

module.exports = router

router
  .route('/')
  .get(organizations.getAll)

router.route('/:org_id')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organizations'], options),
    organizations.getByID
  )
  .patch(
    // checkJWTScopes(['update:organizations'], options),
    schemaValidator(organizations.schema.update),
    organizations.update
  )

router.route('/:org_id/members')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organization_members'], options),
    organizations.getMembers
  )

router.route('/:org_id/connections')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organization_connections'], options),
    organizations.getEnabledConnections
  )

router.route('/:org_id/connections/:connection_id')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['update:organization_connections'], options),
    organizations.getEnabledConnection
  )
  .patch(
    // checkJWTScopes(['update:organization_connections'], options),
    organizations.updateEnabledConnection
  )
  .post(
    // checkJWTScopes(['create:organization_connections'], options),
    organizations.createEnabledConnection
  )
