<template>
  <v-card class="pa-6" color="blue lighten-5">
    <v-card-title>
      Organization Manager
    </v-card-title>
    <v-card-text>
        The purpose of this application is to demonstrate how a single page application (SPA) can be used to provide
        managers of an Auth0 organization the ability to manage their organization.
      </v-card-text>

    <v-card class="pa-6" outlined>
      <v-card-title>
        Organizations Found
      </v-card-title>
      <v-list v-if="organizations.length" flat>
        <v-list-item-group v-model="selectedOrg" color="primary">
          <v-list-item v-for="(item, i) in organizations" :key="i" @click="authenticate(item.id)">
            
            <v-list-item-icon>
              <v-avatar tile>
                <v-img :src="item.branding.logo_url" max-height="40" max-width="40" ></v-img>
              </v-avatar>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>({{ item.name }}) {{ item.display_name }}</v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      selectedOrg: 0,
      organizations: []
    }
  },
  async mounted () {
    const orgs = await this.getOrganizations()
    this.organizations = orgs.data

    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Home')
      console.log(orgs)
    }
  },
  methods: {
    async getOrganizations () {
      const response = await this.$http(null).get(`/organizations`)
      return response.data
    },
    // https://auth0.com/blog/complete-guide-to-vue-user-authentication/#Add-User-Authentication
		async authenticate(organization) {
			if (this.$auth.isAuthenticated) {
        this.$router.push({ path: '/dashboard' })
			} else {
				// https://auth0.github.io/auth0-spa-js/interfaces/redirectloginoptions.html
				const scope = [ 'openid', 'profile', 'email' ].join(' ')
				this.$auth.loginWithRedirect({ scope, organization })
			}
		}
  }
}
</script>