const responseFormatter = require('./../middleware/responseFormatter')
const scopes = [
  'read:organizations',
  'update:organizations',

  'read:organization_members',
  
  'create:organization_member_roles',
  'read:organization_member_roles',
  'delete:organization_member_roles',

  'create:organization_connections',
  'read:organization_connections',
  'update:organization_connections',
  
  'create:organization_invitations',
  'read:organization_invitations',
  'delete:organization_invitations'
]
const management = require('./../models/management')(scopes)

module.exports = {
  list,
  getByID,
  getMembers,
  update,
  readMemberRoles,
  listEnabledConnections,
  getEnabledConnection,
  createEnabledConnection,
  updateEnabledConnection,
  listInvitations,
  getInvitation,
  createInvitation,
  deleteInvitation,
  schema: {
    organization: {
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
    },
    connection: {
      type: 'object',
      required: [ 'connection_id' ],
      properties: {
        assign_membership_on_login: { type: 'boolean' }
      }
    },
    invitation: {
      type: 'object',
      required: [
        'inviter',
        'invitee',
        'client_id'
      ],
      properties: {
        inviter: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        },
        invitee: {
          type: 'object',
          properties: {
            email: { type: 'string' }
          }
        },
        client_id: { type: 'string', description: 'Auth0 client ID. Used to resolve the application\'s login initiation endpoint.' },
        connection_id: { type: 'string', description: '' },
        app_metadata: { type: 'object' },
        user_metadata: { type: 'object' },
        ttl_sec: { type: 'integer', minimum: 0, maximum: 2592000 },
        roles: {
          type: 'array',
          description: 'An array of role id\'s to assign to the invitee',
          items: { type: 'string' }
        },
        send_invitation_email: { type: 'boolean' }
      }
    }
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

// organization
async function list (req, res) {
  try {
    const options = {
      per_page: parseInt(req.query.limit) || 50,
      page: parseInt(req.query.page) || 0
    }
    const data = await management.organizations.getAll(options)
    const payload = {
      status: 200,
      message: `Found ${data.length} organizations`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function getByID (req, res) {
  const id = req.params.org_id
  try {
    const data = await management.organizations.getByID({ id })
    const payload = {
      status: 200,
      message: `Found details for "${data.display_name}".`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function getMembers (req, res) {
  const id = req.params.org_id
  try {
    const data = await management.organizations.getMembers({ id })
    const payload = {
      status: 200,
      message: `Found ${data.length} members of organization.`,
      data
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function update (req, res) {
  const id = req.params.org_id
  const body = req.body
  try {
    const data = await management.organizations.update({ id }, body)
    const payload = {
      status: 200,
      message: `Updated organization ${data.name}`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

// roles
async function readMemberRoles (req, res) {
  const id = req.params.org_id
  const user_id = req.params.user_id
  try {
    const data = await management.organizations.getMemberRoles({ id, user_id })
    const payload = {
      status: 200,
      message: `Found ${data.length} roles for member ${user_id}.`,
      data
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

// connections
async function listEnabledConnections (req, res) {
  const id = req.params.org_id
  try {
    const data = await management.organizations.getEnabledConnections({ id })
    const payload = {
      status: 200,
      message: `Found ${data.length} enabled connections for organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function getEnabledConnection (req, res) {
  const id = req.params.org_id
  const connection_id = req.params.connection_id
  try {
    const data = await management.organizations.getEnabledConnection({ id, connection_id })
    const payload = {
      status: 200,
      message: `Found connection id: ${connection_id} enabled for organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function createEnabledConnection (req, res) {
  const id = req.params.org_id
  const connection_id = req.params.connection_id
  const body = Object.assign({ connection_id }, req.body)
  try {
    const data = await management.organizations.addEnabledConnection({ id }, body)
    const payload = {
      status: 200,
      message: `Added connection to organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function updateEnabledConnection (req, res) {
  const id = req.params.org_id
  const connection_id = req.params.connection_id
  const body = req.body
  try {
    const data = await management.organizations.updateEnabledConnection({ id, connection_id }, body)
    const payload = {
      status: 200,
      message: `Updated enabled connection for organization`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

// invitations
async function listInvitations (req, res) {
  const id = req.params.org_id
  try {
    const data = await management.organizations.getInvitations({ id })
    const payload = {
      status: 200,
      message: `Found ${data.length} invitations for organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function getInvitation (req, res) {
  const id = req.params.org_id
  const invitation_id = req.params.invitation_id
  try {
    const data = await management.organizations.getInvitation({ id, invitation_id })
    const payload = {
      status: 200,
      message: `Found invitation to organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function createInvitation (req, res) {
  const id = req.params.org_id
  const body = req.body
  try {
    const data = await management.organizations.createInvitation({ id }, body)
    const payload = {
      status: 200,
      message: `Found invitation to organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}

async function deleteInvitation (req, res) {
  const id = req.params.org_id
  const invitation_id = req.params.invitation_id
  try {
    const data = await management.organizations.deleteInvitation({ id, invitation_id })
    const payload = {
      status: 200,
      message: `Removed invitation to organization.`,
      data 
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  } catch (error) {
    handleError(req, res, error)
  }
}
