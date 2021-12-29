<template>
	<div>
		<!-- Application bar -->
		<v-app-bar app clipped-left dark>
			<v-btn plain float-left max-height="50" href="https://auth0.com/" target="__blank">
				<v-img :src="shield" contain max-height="40"></v-img>
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
		<v-navigation-drawer app floating :clipped="true" permanent dark>
			
			<v-list>
				<!-- The user avatar, or empty avatar with login  -->
				<v-list-item v-if="$auth.isAuthenticated" class="px-2" link to="/profile">
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

				<v-list-item v-else class="px-2" link @click="authenticate()" >
					<v-list-item-avatar color="primary">
						<v-icon x-large>{{ mdiAccountCircle }}</v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="text-h6">
							<!-- Login -->
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<!-- Login / Logout button -->
				<v-list-item @click="authenticate()">
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
				<v-list-item v-for="item in routes" :key="item.title" :to="item.to">
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
		auth0docs: require('../assets/auth0docs.svg')
	}),
	computed: {
		routes() {
			let routes = [
				{ title: 'Home', icon: mdiHomeCircle , to: '/', auth: false },
				{ title: 'Dashboard', icon: mdiMonitorDashboard , to: '/dashboard', auth: true },
				{ title: 'Debug', icon: mdiCogOutline , to: '/debug', auth: true }
			]
			return this.$auth.isAuthenticated ? routes : routes.filter(x => !x.auth)
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