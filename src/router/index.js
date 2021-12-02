import Vue from 'vue'
import Router from 'vue-router'
import { authenticationGuard } from "@/helpers/authenticationGuard";
// import Meta from 'vue-meta'

import Home from '@/views/Home.vue'

// Vue.use(Meta, {
// 	keyName: 'metaInfo',
// 	attribute: 'data-vue-meta',
// 	ssrAttribute: 'data-vue-meta-server-rendered',
// 	tagIDKeyName: 'vmid',
// 	refreshOnceOnNavigation: true
// })

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home }
  ]
})

export default router
