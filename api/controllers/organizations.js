const responseFormatter = require('./../middleware/responseFormatter')
const scopes = [
  'read:organizations',
  'update:organizations',
  'read:organization_members',
  'update:organization_members',
  'create:organization_connections',
  'read:organization_connections',
  'update:organization_connections'
]
const management = require('./../models/management')(scopes)

module.exports = {
  getAll,
  getByID,
  getMembers,
  update,
  getEnabledConnections,
  getEnabledConnection,
  createEnabledConnection,
  updateEnabledConnection,
  schema: {
    createConnection: {
      type: 'object',
      required: [ 'connection_id' ],
      properties: {
        assign_membership_on_login: { type: 'boolean' }
      }
    },
    update: {
      type: 'object',
      description: '',
      required: [],
      properties: {
        display_name: { type: 'string' },
        name: { type: 'string' },
        branding: {
          type: 'object',
          required: [],
          properties: {
            logo_url: { type: 'string' },
            colors: {
              type: 'object',
              required: [],
              properties: {
                primary: { type: 'string' },
                page_background: { type: 'string' }
              }
            }
          }
        },
        metadata: { type: 'object' }
      }
    }
  }
}

// organization
/**
 * Get alist of all Organizations defined on the tenant.
 * 
 * @param {Object} req Express.js request object 
 * @param {Object} res Express.js response object
 */
async function getAll (req, res) {
  let status = 200
  let message = ``
  let data = []
  try {
    const options = {
      per_page: parseInt(req.query.limit) || 50,
      page: parseInt(req.query.page) || 0
    }
    data = await management.organizations.getAll(options)
    message = `Found ${data.length} organizations`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }

  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

async function getByID (req, res) {
  const id = req.params.org_id
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.getByID({ id })
    message = `Found details for "${data.display_name}".`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

async function getMembers (req, res) {
  const id = req.params.org_id
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.getMembers({ id })
    message = `Found ${data.length} members of organization.`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

async function update (req, res) {
  const id = req.params.org_id
  const body = req.body
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.update({ id }, body)
    message = `Updated organization`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

// connections
async function getEnabledConnections (req, res) {
  const id = req.params.org_id
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.getEnabledConnections({ id })
    message = `Found enabled connections for organization.`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

async function getEnabledConnection (req, res) {
  const id = req.params.org_id
  const connection_id = req.params.connection_id
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.getEnabledConnection({ id })
    message = `Found enabled connections for organization.`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

async function createEnabledConnection (req, res) {
  const id = req.params.org_id
  const connection_id = req.params.connection_id
  const body = Object.assign({ connection_id }, req.body)
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.addEnabledConnection({ id }, body)
    message = `Added connection to organization`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}

async function updateEnabledConnection (req, res) {
  const id = req.params.org_id
  const connection_id = req.params.connection_id
  const body = req.body
  let status = 200
  let message = ``
  let data = []
  try {
    data = await management.organizations.updateEnabledConnection({ id, connection_id }, body)
    message = `Updated enabled connection for organization`
  } catch (error) {
    status = parseInt(error.statusCode) || 500
    message = error.message
    data = error
  }
  
  const json = responseFormatter(req, res, { status, message, data })
  res.status(status).json(json)
}
