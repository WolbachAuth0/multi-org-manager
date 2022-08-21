<template>
	<div>
		<!-- Application bar -->
		<v-app-bar app clipped-left dark class="primary accent-3">
			<v-btn id="logo" plain float-left max-height="50" :href="oktahomeURL" target="__blank">
				<v-img :src="logo" contain max-height="50"></v-img>
			</v-btn>
			
      <v-toolbar-title >
				Organization Manager Experiment
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-btn plain max-height="50" href="https://auth0.com/docs" target="__blank">
					<v-img :src="auth0docs" contain max-height="50"></v-img>
				</v-btn>
			</v-toolbar-items>
		</v-app-bar>

		<!-- Navigation Drawer -->
		<v-navigation-drawer app floating :clipped="true" permanent dark class="primary">
			
			<v-list>
				<!-- The user avatar, or empty avatar with login  -->
				<v-list-item v-if="$auth.isAuthenticated" class="px-2 primary" link to="/profile">
					<v-list-item-avatar>
						<img :src="$auth.user.picture" :alt="$auth.user.name">
					</v-list-item-avatar>					
					<v-list-item-content v-if="$auth.isAuthenticated">
						<v-list-item-title class="text-h6">
							{{ $auth.user.name }}
						</v-list-item-title>
						<v-list-item-subtitle>
							{{ $auth.user.email}}
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>

				<v-list-item v-else class="px-2 primary" link @click="authenticate()">
					<v-list-item-avatar color="blue darken-3">
						<v-icon x-large>{{ mdiAccountCircle }}</v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="text-h6">
							<!-- Login -->
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<!-- Login / Logout button -->
				<v-list-item @click="authenticate()" class="px-2 primary">
					<v-list-item-icon>
						<v-icon>{{ signInOut.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ signInOut.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

			</v-list>

			<v-divider></v-divider>

			<v-list dense nav>
				<v-list-item v-for="item in routes" :key="item.title" :to="item.to" class="primary">
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
import {
	mdiCogOutline,
	mdiHomeCircle,
	mdiApplicationCog,
	mdiMonitorDashboard,
	mdiLogoutVariant,
	mdiLoginVariant,
	mdiAccountCircle, 
} from '@mdi/js'

export default {
	name: 'Navigation',
	data: () => ({
		shieldSRC: 'https://cdn.auth0.com/manhattan/versions/1.3435.0/assets/./badge.png',
		shield: require('../assets/shield.svg'),
		logo: require('../assets/okta-logo-white.svg'),
		auth0docs: require('../assets/auth0docs.svg'),
		oktahomeURL: 'https://www.okta.com/',
		auth0docsURL: 'https://auth0.com/docs'
	}),
	computed: {
		routes() {
			const roles = this.$auth.isAuthenticated ? this.$auth.user['science-experiment/roles'] : []
			const isAdmin = roles.includes('Organization Member Administrator')
			const isOwner = roles.includes('Organization Owner')
			const isMember = roles.includes('Organization Member')
			let routes = [
				{
					title: 'Home',
					icon: mdiHomeCircle ,
					to: '/',
					show: true
				},
				{
					title: 'Member Portal',
					icon: mdiApplicationCog,
					to: '/members',
					show: isMember
				},
				{
					title: 'Admin Dashboard',
					icon: mdiMonitorDashboard,
					to: '/dashboard',
					show: isAdmin
				},
				{
					title: 'Debug',
					icon: mdiCogOutline,
					to: '/debug',
					show: true
				}
			]
			return routes.filter(x => x.show)
		},
		signInOut() {
			return {
				icon: this.$auth.isAuthenticated ? mdiLogoutVariant : mdiLoginVariant,
				title: this.$auth.isAuthenticated ? 'Log Out' : 'Log In',
			}
		},
		mdiAccountCircle() {
			return mdiAccountCircle
		}
	},
	methods: {
		// https://auth0.com/blog/complete-guide-to-vue-user-authentication/#Add-User-Authentication
		async authenticate() {
			if (this.$auth.isAuthenticated) {
				// https://auth0.github.io/auth0-spa-js/interfaces/logoutoptions.html
				this.$auth.logout({ returnTo: process.env.VUE_APP_DOMAIN })
        this.$router.push({ path: '/' })
			} else {
				// https://auth0.github.io/auth0-spa-js/interfaces/redirectloginoptions.html
				const scopes = [ 'openid', 'profile', 'email' ]
				this.$auth.loginWithRedirect({ scope: scopes.join(' ') })
			}
		}
	}
}
</script>

<style scoped>
	#logo {
		opacity: 1.00;
	}
</style>
