import Vue from 'vue'
import Router from 'vue-router'
import { authenticationGuard, roleGuardian } from "@/helpers/authenticationGuard";
import Meta from 'vue-meta'

// Views
import Home from '@/views/Home.vue'
import Tokens from '@/views/Tokens.vue'
import Profile from '@/views/Profile.vue'
import Members from '@/views/Members.vue'
import Dashboard from '@/views/Dashboard.vue'

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
    {
      path: '/',
      name: 'Welcome',
      component: Home
    },
    {
      path: '/login',
      redirect (to) {
        return {
          path: `https://${process.env.VUE_APP_CUSTOM_DOMAIN}/authorize`,
          query: to.query
        }
      }
    },
    {
      path: '/tokens',
      name: 'Tokens',
      component: Tokens,
      beforeEnter: authenticationGuard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: authenticationGuard
    },
    {
      path: '/members',
      name: 'Members Portal',
      component: Members,
      beforeEnter: roleGuardian('Member')
    },
    {
      path: '/dashboard',
      name: 'Admin Dashboard',
      component: Dashboard,
      beforeEnter: roleGuardian('Administrator')
    },
  ]
})

export default router
