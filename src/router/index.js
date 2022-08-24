import Vue from 'vue'
import Router from 'vue-router'
import { authenticationGuard } from "@/helpers/authenticationGuard";
import Meta from 'vue-meta'

// Views
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Tokens from '@/views/Tokens.vue'
import Members from '@/views/Members.vue'

Vue.use(Meta, {
	keyName: 'metaInfo',
	attribute: 'data-vue-meta',
	tagIDKeyName: 'vmid',
	refreshOnceOnNavigation: true
})
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'Welcome', component: Home },
    { path: '/members', name: 'Members Portal', component: Members, beforeEnter: authenticationGuard },
    { path: '/dashboard', name: 'Admin Dashboard', component: Dashboard, beforeEnter: authenticationGuard },
    { path: '/tokens', name: 'Tokens', component: Tokens, beforeEnter: authenticationGuard }
  ]
})

export default router
