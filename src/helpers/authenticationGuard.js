  
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


