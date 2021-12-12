const router = require('express').Router()
const responseFormatter = require('./../middleware/responseFormatter')
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')

const scopes = [
  'read:organizations',
  'read:organization_members',
  'read:organization_connections',
  'update:organizations'
]
const management = require('./../models/management')(scopes)

module.exports = router

router
  // .all(verifyJWT)
  .route('/:org_id/members')
  .get(
    // checkJWTScopes(['read:organization_members'], options),
    async (req, res) => {
      const id = req.params.org_id
      let status = 200
      let message = `found members of organization: ${id}`
      let data = []
      try {
        data = await management.organizations.getMembers({ id })
      } catch (error) {
        status = parseInt(error.statusCode) || 500
        message = error.message
        data = error
      }
      
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    }
  )

  router
  // .all(verifyJWT)
  .route('/:org_id')
  .get(
    // checkJWTScopes(['read:organizations'], options),
    async (req, res) => {
      const id = req.params.org_id
      let status = 200
      let message = `found members of organization: ${id}`
      let data = []
      try {
        data = await management.organizations.getByID({ id })
      } catch (error) {
        status = parseInt(error.statusCode) || 500
        message = error.message
        data = error
      }
      
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    }
  )