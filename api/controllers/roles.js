const responseFormatter = require('./../middleware/responseFormatter')
const scopes = [
  'read:roles',
]
const management = require('./../models/management')(scopes)

module.exports = {
  list,
  getByID,
  schema: {
    
  }
}

function handleError (req, res, error) {
  const payload = {
    status: parseInt(error.statusCode) || 500,
    message: error.message || 'An error occurred.',
    data: error
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

// roles
async function list (req, res) {
  try {
    const options = {
      per_page: parseInt(req.query.limit) || 50,
      page: parseInt(req.query.page) || 0
    }
    const data = await management.getRoles(options)
    const payload = {
      status: 200,
      message: `Found ${data.length} roles`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function getByID (req, res) {
  const id = req.params.role_id
  try {
    const data = await management.getRole({ id })
    const payload = {
      status: 200,
      message: `Found details for ${data.name} role.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}
