const responseFormatter = require('./../middleware/responseFormatter')
const scopes = [
  'read:organizations',
  'read:organization_members',
  'read:organization_connections',
  'update:organizations'
]
const management = require('./../models/management')(scopes)

module.exports = {
  getAll,
  getByID,
  getMembers,
  update,
  schema: {
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

async function  getMembers (req, res) {
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

async function  update (req, res) {
  console.log('received patch request.', req.body)
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
