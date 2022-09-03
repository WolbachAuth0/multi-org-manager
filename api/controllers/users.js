const responseFormatter = require('./../middleware/responseFormatter')
const scopes = [
  'read:users',
  // 'read:user_idp_tokens',
  'update:users',
  'update:users_app_metadata',
]
const management = require('./../models/management')(scopes)

module.exports = {
  getById,
  updateProfile,
  updateMetadata
}

function handleError (req, res, error) {
  const payload = {
    status: parseInt(error.statusCode) || 500,
    message: error?.response?.text || error.message || 'An error occurred.',
    data: error
  }
  console.log(payload.message)
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function getById (req, res) {
  const id = req.params.user_id
  try {
    const data = await management.getUser({ id })
    const payload = {
      status: 200,
      message: `Found user by id: ${id}.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

/*

  Update User Schema
  https://auth0.com/docs/api/management/v2#!/Users/patch_users_by_id

  {
    "given_name": "John",
    "family_name": "Doe",
    "name": "John Doe",
    "nickname": "Johnny",
    "picture": "",
  }
*/

async function updateProfile (req, res) {
  const id = req.params.user_id
  const connection = id.split('|')[0]
  const user = req.body

  if (!['auth0', 'email', 'sms'].includes(connection)) {
    // can't update - throw 400 bad request
  }

  try {
    const data = await management.updateUser({ id }, user)
    const payload = {
      status: 200,
      message: `Updated user ${id}.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function updateMetadata (req, res) {
  const id = req.params.user_id
  const metadata = req.body.user_metadata  
  try {
    const data = await management.updateUserMetadata({ id }, metadata)
    const payload = {
      status: 200,
      message: `Found user by id: ${id}.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

