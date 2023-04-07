/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'science-experiment'
  const roles = event.authorization?.roles
  
  if (!roles?.length) { return }

  api.idToken.setCustomClaim(`${namespace}/roles`, roles)
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles)
};