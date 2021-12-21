<template>
  <v-card>

    <v-card-title>
      <v-avatar tile v-if="logoIsAvailable">
        <v-img :src="org.branding.logo_url" max-height="40" max-width="40" ></v-img>
      </v-avatar>
      <v-avatar tile v-else>
        <v-progress-circular :size="40" color="primary" indeterminate></v-progress-circular>
      </v-avatar>

      <h2 v-if="orgNameIsAvailable">{{ org.display_name }}</h2>
    </v-card-title>

    <v-tabs v-model="tab">
      <v-tabs-slider color="blue"></v-tabs-slider>

      <v-tab key="overview">Overview</v-tab>
      <v-tab key="members">Members</v-tab>
      <v-tab key="invitations">Invitations</v-tab>
      <v-tab key="connections">Connections</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="overview">
        <org-overview ></org-overview>
      </v-tab-item>

      <v-tab-item key="members">
        <org-members :org="org"></org-members>
      </v-tab-item>

      <v-tab-item key="invitations">
        <org-invitations :org="org"></org-invitations>
      </v-tab-item>

      <v-tab-item key="connections">
        <org-connections :org="org"></org-connections>
      </v-tab-item>
    </v-tabs-items>

  </v-card>
</template>

<script>
import OrgOverview from '../components/Organization/OrgOverview.vue'
import OrgMembers from '../components/Organization/OrgMembers.vue'
import OrgInvitations from '../components/Organization/OrgInvitations.vue'
import OrgConnections from '../components/Organization/OrgConnections.vue'

export default {
  components: {
    OrgOverview,
    OrgMembers,
    OrgInvitations,
    OrgConnections
  },
  name: 'Dashboard',
  metaInfo: {
    title: 'Dashboard',
  },
  data () {
    return {
      tab: null,
      user: {},
      org: {},
      orgAvailable: false,
    }
  },
  async created () {
    const response = await this.fetchOrg()
    this.org = response.data
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Dashboard')
      console.log(response.data)
    }
  },
  computed: {
    logoIsAvailable () {
      return this.org && this.org.branding && this.org.branding.logo_url
    },
    orgNameIsAvailable () {
      return this.org && this.org.display_name
    }
  },
  methods: {
    async fetchOrg () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}`)
      return response.data
    }
  }
}
</script>