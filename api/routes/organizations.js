const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const organizations = require('./../controllers/organizations')

module.exports = router

function checkJWTOrgID(org_id) {
  return checkJWTScopes([org_id], { customScopeKey: 'org_id', failWithError: true })
}

function checkJWTPermissions() {
  return checkJWTScopes(permissions, { customScopeKey: 'permissions', failWithError: true })
}

// Organizations
router
  .route('/')
  .get(organizations.list)

router.route('/:org_id')
  .all(verifyJWT)
  .all(checkJWTOrgID(req.params.org_id))
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
  .all(checkJWTOrgID(req.params.org_id))
  .get(
    checkJWTPermissions(['read:members']),
    organizations.getMembers
  )

// Organization Member Roles
router.route('/:org_id/members/:user_id/roles')
  .all(verifyJWT)
  .all(checkJWTOrgID(req.params.org_id))
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
  .all(checkJWTOrgID(req.params.org_id))
  .get(
    checkJWTPermissions(['read:connections']),
    organizations.listEnabledConnections
  )

router.route('/:org_id/connections/:connection_id')
  .all(verifyJWT)
  .all(checkJWTOrgID(req.params.org_id))
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
  .all(checkJWTOrgID(req.params.org_id))
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
  .all(checkJWTOrgID(req.params.org_id))
  .get(
    checkJWTPermissions(['read:invitations']),
    organizations.getInvitation
  )
  .delete(
    checkJWTPermissions(['delete:invitations']),
    organizations.deleteInvitation
  )