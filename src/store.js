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
    organization () {}
  },
  mutations: {

  }
}

export const store = new Vuex.Store(options)
