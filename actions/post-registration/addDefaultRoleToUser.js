/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/
exports.onExecutePostUserRegistration = async (event) => {
  const namespace = 'https://auth0.com';
  const ManagementClient = require('auth0').ManagementClient;

  function createManagementClient () {
    const management = new ManagementClient({
      domain: event.secrets.DOMAIN,
      clientId: event.secrets.CLIENT_ID,
      clientSecret: event.secrets.CLIENT_SECRET,
      scope: 'read:roles update:users create:role_members'
    });
    return management
  }

  const userRole = {
    id: 'rol_bauILE6QiYVsFEfO', // ID of Member Role in your Tenant.
    name: 'User'
  }

  try {
    const management = createManagementClient();
    await management.assignRolestoUser(
      { id: event.user.user_id },
      { roles: [ userRole.id ] }
    );
  } catch (err) {
    console.error(err);
  }
}
