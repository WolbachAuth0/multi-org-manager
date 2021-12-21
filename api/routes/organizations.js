const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const organizations = require('./../controllers/organizations')

module.exports = router

// Organizations
router
  .route('/')
  .get(organizations.list)

router.route('/:org_id')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organizations'], options),
    organizations.getByID
  )
  .patch(
    // checkJWTScopes(['update:organizations'], options),
    schemaValidator(organizations.schema.organization),
    organizations.update
  )

// Organization Members
router.route('/:org_id/members')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organization_members'], options),
    organizations.getMembers
  )

// Organization Connections
router.route('/:org_id/connections')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organization_connections'], options),
    organizations.listEnabledConnections
  )

router.route('/:org_id/connections/:connection_id')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['update:organization_connections'], options),
    organizations.getEnabledConnection
  )
  .patch(
    // checkJWTScopes(['update:organization_connections'], options),
    schemaValidator(organizations.schema.connection),
    organizations.updateEnabledConnection
  )
  .post(
    // checkJWTScopes(['create:organization_connections'], options),
    schemaValidator(organizations.schema.update),
    organizations.createEnabledConnection
  )

router.route('/:org_id/invitations')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organization_invitations'], options),
    organizations.listInvitations
  )
  .post(
    // checkJWTScopes(['create:organization_invitations'], options),
    schemaValidator(organizations.schema.invitation),
    organizations.createInvitation
  )

router.route('/:org_id/invitations/:invitation_id')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:organization_invitations'], options),
    organizations.getInvitation
  )

  .delete(
    // checkJWTScopes(['delete:organization_invitations'], options),
    organizations.deleteInvitation
  )