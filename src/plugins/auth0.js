/**
 *  External Modules
 */
 import Vue from "vue"
 import createAuth0Client from "@auth0/auth0-spa-js"
 
/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname)
const DEFAULT_REDIRECT_URI = `${process.env.VUE_APP_DOMAIN}/dashboard`
 
let instance

export const getInstance = () => instance

export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = DEFAULT_REDIRECT_URI,
  ...options
}) => {
  if (instance) return instance

  instance = new Vue({
    data() {
      return {
        isLoading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        error: null,
      }
    },
    methods: {
      async loginWithPopup(options, config) {
        this.popupOpen = true

        try {
          await this.auth0Client.loginWithPopup(options, config)
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = await this.auth0Client.isAuthenticated()
          this.error = null
        } catch (e) {
          console.error(e)
          this.error = e
        } finally {
          this.popupOpen = false
        }
      },
      async handleRedirectCallback() {
        this.isLoading = true
        try {
          await this.auth0Client.handleRedirectCallback()
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = true
        } catch (error) {
          this.error = error
        } finally {
          this.isLoading = false
        }
      },
      loginWithRedirect(opts) {
        // always ensure that openid, profile and email are requested scopes.
        const scopes = ['openid', 'profile', 'email'] 
        let options = {}

        if (typeof opts != 'object') {
          options.scope = scopes.join(' ')
        } else {
          const scope = scopes
            .concat(opts.hasOwnProperty('scope') ? opts.scope.split(' ') : [])
            .filter((v,i,A) => A.indexOf(v) == i)
            .join(' ')
          options = Object.assign(opts, { scope })
        }
        return this.auth0Client.loginWithRedirect(options)
      },
      getIdTokenClaims(opts) {
        return this.auth0Client.getIdTokenClaims(opts)
      },
      getTokenSilently(opts) {
        return this.auth0Client.getTokenSilently(opts)
      },
      getTokenWithPopup(opts) {
        return this.auth0Client.getTokenWithPopup(opts)
      },
      logout(opts) {
        const options = Object.assign(typeof opts == 'object' ? opts : {}, { returnTo: process.env.VUE_APP_AUTH0_LOGOUTURL })
        return this.auth0Client.logout(options)
      }
    },
    async created() {
      this.auth0Client = await createAuth0Client({
        ...options,
        client_id: options.clientId,
        redirect_uri: redirectUri,
      })

      try {
        if (
          window.location.search.includes('code=') &&
          window.location.search.includes('state=')
        ) {
          const { appState } = await this.auth0Client.handleRedirectCallback()
          this.error = null
          onRedirectCallback(appState)
        }
      } catch (error) {
        this.error = error
      } finally {
        this.isAuthenticated = await this.auth0Client.isAuthenticated()
        this.user = await this.auth0Client.getUser()
        this.isLoading = false
      }
    },
  })

  return instance
}

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options)
  },
}
