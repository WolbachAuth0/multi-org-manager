<template>
	<div>
		<!-- Application bar -->
		<v-app-bar app clipped-left dark class="primary accent-3">

			<a id="logo" :href="oktahomeURL" target="__blank">
				<v-img :src="logo" contain max-height="50" max-width="225"></v-img>
			</a>
			
      <v-toolbar-title>
				Organization Manager Experiment
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-title>
				<a id="auth0docs" href="https://auth0.com/docs" target="__blank">
					<v-img :src="auth0docs" contain max-height="64"></v-img>
				</a>
			</v-toolbar-title>
		</v-app-bar>

		<!-- Navigation Drawer -->
		<v-navigation-drawer app floating :clipped="true" permanent dark class="primary">
			
			<v-list nav>							
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
							Login
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>


			<!-- Login to Organizations -->
			<v-divider v-if="!$auth.isAuthenticated"></v-divider>

			<v-list v-if="!$auth.isAuthenticated" dense nav>
				<v-list-item  v-for="(item, i) in organizations" :key="i" @click="authenticate(item.id)">
					<v-list-item-icon>
						<div class="rounded-circle d-inline-block white p-4">
							<v-img :src="item.branding.logo_url" max-height="25" max-width="25" ></v-img>
						</div>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list dense nav>
				<!-- Application Routes -->
				<v-list-item v-for="item in routes" :key="item.title" :to="item.to" class="primary" active-class="secondary">
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<!-- Logout button -->
				<v-list-item v-if="$auth.isAuthenticated" @click="logout()" class="px-2 primary">
					<v-list-item-icon>
						<v-icon>{{ mdiLogoutVariant }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>Log Out</v-list-item-title>
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
		auth0docsURL: 'https://auth0.com/docs',
		organizations: [],
		mdiLogoutVariant,
	}),
	computed: {
		routes () {
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
					title: 'Tokens',
					icon: mdiCogOutline,
					to: '/tokens',
					show: this.$auth.isAuthenticated
				}
			]
			return routes.filter(x => x.show)
		},
		mdiAccountCircle () {
			return mdiAccountCircle
		},
	},
	async mounted () {
    const orgs = await this.getOrganizations()
    this.organizations = orgs.data
		console.log(this.organizations)
  },
	methods: {
		async getOrganizations () {
      const response = await this.$http(null).get(`/organizations`)
      return response.data
    },
    // https://auth0.com/blog/complete-guide-to-vue-user-authentication/#Add-User-Authentication
		async authenticate (organization) {
			if (this.$auth.isAuthenticated) {
				const roles = this.$auth.isAuthenticated ? this.$auth.user['science-experiment/roles'] : []
				this.redirect(roles)
			} else {
				this.login(organization)
			}
		},
		async redirect (roles) {
			const isAdmin = roles.includes('Organization Member Administrator')
			const isOwner = roles.includes('Organization Owner')
			const isMember = roles.includes('Organization Member')
			let path = '/'
			
			if (isAdmin) {
				path = '/dashboard'
			} else if (isOwner || isMember) {
				path = '/members'
			}

			this.$router.push({ path })
		},
		async login (organization) {
			// https://auth0.github.io/auth0-spa-js/interfaces/redirectloginoptions.html
			if (!this.$auth.isAuthenticated) {
				const options = {
					scope: 'openid profile email',
					organization
				}
				this.$auth.loginWithRedirect(options)
			}
		},
		async logout () {
			if (this.$auth.isAuthenticated) {
				// https://auth0.github.io/auth0-spa-js/interfaces/logoutoptions.html
				this.$auth.logout({ returnTo: process.env.VUE_APP_DOMAIN })
        this.$router.push({ path: '/' })
			}
		}
	}
}
</script>
