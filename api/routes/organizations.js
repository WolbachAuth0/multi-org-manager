const router = require('express').Router()
const { verifyJWT, checkJWTScopes, checkJWTPermissions } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const organizations = require('./../controllers/organizations')

module.exports = router

function checkJWTOrgID (req, res, next) {
  const customScopeKey = 'org_id'
  const failWithError = true
  const orgIDs = [ req.params.org_id ]
  return checkJWTScopes(orgIDs, { customScopeKey, failWithError })(req, res, next)
}

// Organizations
router
  .route('/')
  .get(organizations.list)

router.route('/:org_id')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['read:organizations']),
    organizations.getByID
  )
  .patch(
    checkJWTPermissions(['update:organizations']),
    schemaValidator(organizations.schema.organization),
    organizations.update
  )

// Organization Members
router.route('/:org_id/members')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['read:members']),
    organizations.getMembers
  )

// Organization Member Roles
router.route('/:org_id/members/:user_id/roles')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['read:member_roles']),
    organizations.readMemberRoles
  )
  .post(
    checkJWTPermissions(['create:member_roles']),
    schemaValidator(organizations.schema.roles),
    organizations.addMemberRoles
  )
  .delete(
    checkJWTPermissions(['delete:member_roles']),
    organizations.removeMemberRoles
  )

// Organization Connections
router.route('/:org_id/connections')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['read:connections']),
    organizations.listEnabledConnections
  )

router.route('/:org_id/connections/:connection_id')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['update:connections']),
    organizations.getEnabledConnection
  )
  .patch(
    checkJWTPermissions(['update:connections']),
    schemaValidator(organizations.schema.connection),
    organizations.updateEnabledConnection
  )
  .post(
    checkJWTPermissions(['create:connections']),
    schemaValidator(organizations.schema.update),
    organizations.createEnabledConnection
  )

router.route('/:org_id/invitations')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['read:invitations']),
    organizations.listInvitations
  )
  .post(
    checkJWTPermissions(['create:invitations']),
    schemaValidator(organizations.schema.invitation),
    organizations.createInvitation
  )

router.route('/:org_id/invitations/:invitation_id')
  .all(verifyJWT)
  .all(checkJWTOrgID)
  .get(
    checkJWTPermissions(['read:invitations']),
    organizations.getInvitation
  )
  .delete(
    checkJWTPermissions(['delete:invitations']),
    organizations.deleteInvitation
  )