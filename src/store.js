import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const options = {
  state: {
    clientApp: {
      id: process.env.VUE_APP_AUTH0_CLIENT_ID
    },
    orgs: [],
    organization: {

    }
  },
  getters: {
    orgs () {},
    async organizations () {
      const response = await this.$http(null).get(`/organizations`)
      return response.data
    }
  },
  mutations: {

  }
}

const store = new Vuex.Store(options)
export default store