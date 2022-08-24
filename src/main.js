import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
// import store from './store'

import Axios from './plugins/axios'
import vuetify from '@/plugins/vuetify'
import { Auth0Plugin } from '@/plugins/auth0'

Vue.use(Axios)
Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_CUSTOM_DOMAIN,
  // domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  onRedirectCallback: (appState) => {
    router.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
  }
})

Vue.config.errorHandler = function (err, vm, info) {
  console.error(err)
  console.log(info)
}
Vue.config.productionTip = false

new Vue({
  router,
  // store,
  vuetify,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
