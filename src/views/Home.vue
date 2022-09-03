<template>
  <v-card>

    <v-card-title>
      <h2>Organization Manager</h2>
    </v-card-title>

    <v-tabs v-model="tab">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab key="about">About</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item key="about">
        <v-card class="pa-6" color="surface">
          
          <v-card-title>
            Introduction
          </v-card-title>
          <v-card-text>
            
          </v-card-text>

          <v-card-title>
            Purpose
          </v-card-title>
          <v-card-text>

            This single page application (SPA) is intended as an example of how to put theory into practice with many of the use cases surrounding 
            the <a href="www.okta.com">Okta</a> <a href="www.auth0.com">Consumer Identity Cloud</a> (CIC) organizations feature. The application has
            solutions to many common problems that occur in the implementation of an SPA with the CIC platform. But the primary use case we demonstrate 
            a solution to with this application is an answer to the commonly asked question, "how can I permit a member of an organization to administer 
            the organization, but without granting that user access to my CIC tenant?" 
            
            Tasks which an administrator may often wish to handle include

            <v-list dense two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Branding</v-list-item-title>
                  <v-list-item-subtitle>Modify an organization's name, colors and logo</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Members</v-list-item-title>
                  <v-list-item-subtitle>Manage organization members, roles and invitations</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Connections</v-list-item-title>
                  <v-list-item-subtitle>Allow admins to self service adding connections to their organization.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Metadata</v-list-item-title>
                  <v-list-item-subtitle>Modify an organization's metadata.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Multi-factor Authentication</v-list-item-title>
                  <v-list-item-subtitle>Modify the requirements for MFA on the organization.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            In addition to the primary use case, this application demonstrates several other common organization asks. For example,

            <v-list dense >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>How to send a user directly to the login screen for a specific organization?</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>How to customize the HTML of the login screen for each organization?</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>How to add a new connection via the management API></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
            </v-list>

            And last of all, this application is built with other commonly asked for features, which are well known how to solve but never
            demonstrated in the official demo applications. These common features include

            <v-list dense >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>How to display different UI options for users with different roles?</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
            </v-list>
          </v-card-text>


        <!-- <v-card class="pa-6"></v-card> -->

        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mdiGithub } from '@mdi/js'

export default {
  name: 'Home',
  metaInfo: {
    title: 'Welcome',
  },
  data () {
    return {
      tab: null,
      selectedOrg: 0,
      organizations: []
    }
  },
  computed: {
    mdiGithub () {
			return mdiGithub
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