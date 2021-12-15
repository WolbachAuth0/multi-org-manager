<template>
<div>
  <announcer :visible="announcement.visible"
             :text="announcement.text"
             :type="announcement.type"
  ></announcer>

  <v-card>

    <v-card-title>
      <v-avatar tile>
        <v-img :src="org.branding.logo_url" max-height="40" max-width="40" ></v-img>
      </v-avatar>
      {{ org.display_name }}
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
        <org-overview></org-overview>
      </v-tab-item>

      <v-tab-item key="members">
        <org-members></org-members>
      </v-tab-item>

      <v-tab-item key="invitations">
        Invitations
      </v-tab-item>

      <v-tab-item key="connections">
        connections
      </v-tab-item>
    </v-tabs-items>

  </v-card>

</div>
</template>

<script>
import Announcer from '../components/Announcer.vue'
import OrgOverview from '../components/OrgOverview.vue'
import OrgMembers from '../components/OrgMembers.vue'

export default {
  components: {
    Announcer,
    OrgOverview,
    OrgMembers
  },
  name: 'Dashboard',
  data () {
    return {
      tab: null,
      user: {},
      org: {},
      announcement: {
        visible: false,
        text: '',
        type: 'success',
      }
    }
  },
  async mounted () {
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Dashboard')
    }
    const org = await this.fetchOrg()
    this.org = org.data

    const success = org.success
    this.announcement.type = success ? 'success' : 'error' 
    this.announcement.text = org.message
    this.announcement.visible = true

    if (!success) {
      console.log(org.data)
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