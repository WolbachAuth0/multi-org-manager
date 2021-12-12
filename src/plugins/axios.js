import Vue from 'vue'
import axios from 'axios'

export default {
  install() {
    // Vue.prototype.$http = axios
    Vue.prototype.$http = function (accesstoken, timeout=2000) {
      const request = {
        baseURL: process.env.VUE_APP_API_HOST,
        timeout,
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      const http = axios.create(request)
      return http
    }
  }
}
