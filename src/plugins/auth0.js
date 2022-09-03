/**
 * This plugin is the Auth0 vue.js module. It's purpose is to handle authentication
 * and authorization inside the vue.js application.
 */
import Vue from 'vue'
import createAuth0Client from '@auth0/auth0-spa-js'
import { Buffer } from 'buffer'

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname)
const DEFAULT_REDIRECT_URI = `${process.env.VUE_APP_DOMAIN}/profile`
 
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
      async loginWithPopup (options, config) {
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
      async handleRedirectCallback () {
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
      loginWithRedirect (opts) {
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
      /**
       * gives you the raw (undecoded) ID token
       * @param {*} opts 
       * @returns 
       */
      getIdTokenClaims (opts) {
        return this.auth0Client.getIdTokenClaims(opts)
      },
      /**
       * gives you the raw (undecoded) Access Token
       * @param {*} opts 
       * @returns 
       */
      getTokenSilently (opts) {
        return this.auth0Client.getTokenSilently(opts)
      },
      getTokenWithPopup (opts) {
        return this.auth0Client.getTokenWithPopup(opts)
      },
      async getPermissions () {
        const accesstoken  = await this.getTokenSilently()
        const accessTokenDecoded = accesstoken ? this.decodeToken(accesstoken) : { permissions: [] }
        return accessTokenDecoded.permissions
      },
      /**
       * Decodes a token and returns a javascript object
       * @param {String} token A base64 encoded token (access or id) 
       * @returns 
       */
      decodeToken (token) {
        const base64Payload = token.split('.')[1]
        const payload = Buffer.from(base64Payload, 'base64')
        return JSON.parse(payload.toString())        
      },
      logout (opts) {
        const options = Object.assign(typeof opts == 'object' ? opts : {}, { returnTo: process.env.VUE_APP_AUTH0_LOGOUTURL })
        return this.auth0Client.logout(options)
      }
    },
    async created () {
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
