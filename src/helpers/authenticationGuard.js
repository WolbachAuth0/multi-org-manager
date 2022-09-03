  
import { getInstance } from '@/plugins/auth0'

export const authenticationGuard = (to, from, next) => {
  const authService = getInstance()

  // If the Auth0Plugin has loaded already, check the authentication state
  if (!authService.isLoading) {
    return guardAction()
  }

  authService.$watch("isLoading", (isLoading) => {
    if (isLoading === false) {
      return guardAction()
    }
  })

  function guardAction() {
    if (authService.isAuthenticated) {
      return next()
    }
  
    const options = {
      appState: {
        targetUrl: to.fullPath
      }
    }
    authService.loginWithRedirect(options);
  }
}


export const roleGuardian = function (rolename) {
  
  return function (to, from, next) {

    const authService = getInstance()
    if (!authService.isLoading) {
      return guardAction()
    }
    authService.$watch("isLoading", isLoading => {
      if (isLoading === false) {
        return guardAction()
      }
    })

    function guardAction () {
      // if isAuthenticated && hasRole
      if (authService.isAuthenticated && hasRole()) {
        return next()
      }
      if (authService.isAuthenticated) {
        return next({ path: '/profile' })
      }
  
      forceLogin()
    }

    function hasRole () {
      if (!authService.isAuthenticated) { return false }
      const roles = authService.user['science-experiment/roles'] ?? []
      const hasRole = !rolename || roles.includes(rolename)
      return hasRole
    }

    function forceLogin () {
      const options = {
        appState: {
          targetUrl: to.fullPath
        }
      }
      authService.loginWithRedirect(options)
    }
  }

}


/**
 * Valid roles as of this writing are, 'Administrator', 'Organization Owner', 'Member'
 */
