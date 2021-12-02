<template>
	<div>
		<v-app-bar app clipped-left dense dark>
			
      <v-toolbar-title class="float-left">
				<v-img :src="logo" contain max-height="50"></v-img>
			</v-toolbar-title>

			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-avatar rounded color="white" size="48">
					<v-img :src="shieldSRC" contain max-height="50"></v-img>
				</v-avatar>
			</v-toolbar-items>
		</v-app-bar>

		<v-navigation-drawer app floating :clipped="true" permanent expand-on-hover dark>
			
			<v-list>
				<v-list-item class="px-2">
					<v-list-item-avatar v-if="$auth.isAuthenticated">
						<img :src="$auth.user.picture" :alt="$auth.user.name">
					</v-list-item-avatar>
					<v-list-item-avatar color="primary" v-else>
						<v-icon x-large>{{ avatar }}</v-icon>
					</v-list-item-avatar>
				</v-list-item>

				<v-list-item link v-if="$auth.isAuthenticated">
					<v-list-item-content>
						<v-list-item-title class="text-h6">
							{{ $auth.user.name }}
						</v-list-item-title>
						<v-list-item-subtitle>
							{{ $auth.user.email}}
						</v-list-item-subtitle>
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

				<v-list-item href="#" @click="authenticate()">
					<v-list-item-icon>
						<v-icon>{{ signInOut.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ signInOut.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
import {
	mdiCogOutline,
	mdiMonitorDashboard,
	mdiLogoutVariant,
	mdiLoginVariant,
	mdiAccountCircle, 
	mdiInformationOutline 
} from '@mdi/js'

export default {
	name: 'Navigation',
	data: () => ({
		shieldSRC: 'https://cdn.auth0.com/manhattan/versions/1.3435.0/assets/./badge.png',
		logo: require('../assets/auth0.svg')
	}),
	computed: {
		routes() {
			let routes = [
				{ title: 'About', icon: mdiInformationOutline , to: '/', auth: false },
				{ title: 'Profile', icon: mdiAccountCircle , to: '/profile', auth: true },
				{ title: 'Setttings', icon: mdiCogOutline , to: '/settings', auth: true },
				{ title: 'Dashboard', icon: mdiMonitorDashboard , to: '/dashboard', auth: true },
			]
			return this.$auth.isAuthenticated ? routes : routes.filter(x => !x.auth)
		},
		signInOut() {
			return {
				icon: this.$auth.isAuthenticated ? mdiLogoutVariant : mdiLoginVariant,
				title: this.$auth.isAuthenticated ? 'Log Out' : 'Log In',
			}
		},
		avatar() {
			return mdiAccountCircle
		}
	},
	methods: {
		toggleDrawer() {
			this.drawer = !this.drawer
		},
		// https://auth0.com/blog/complete-guide-to-vue-user-authentication/#Add-User-Authentication
		async authenticate() {
			if (this.$auth.isAuthenticated) {
				// https://auth0.github.io/auth0-spa-js/interfaces/logoutoptions.html
				this.$auth.logout({ returnTo: process.env.VUE_APP_DOMAIN })
        this.$router.push({ path: '/' })
			} else {
				// https://auth0.github.io/auth0-spa-js/interfaces/redirectloginoptions.html
				const scopes = [ 'openid', 'profile', 'email'	]
				this.$auth.loginWithRedirect({ scope: scopes.join(' ') })
			}
		}
	}
}
</script>