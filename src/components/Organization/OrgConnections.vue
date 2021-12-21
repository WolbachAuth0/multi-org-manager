<template>
  <v-card class="pa-6" color="blue lighten-5">
    <v-card-title>
      Connections
    </v-card-title>
    <v-card-text>
      These are all the identity providers for this organization. 
      They include databases, social network connections and enterprise connections like active directories.
    </v-card-text>
    
    <v-card class="pa-6">
      
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'OrgConnections',
  data () {
    return {
      connections: []
    }
  },
  async mounted () {
    const response = await this.fetchOrgMembers()
    this.connections = response.data
    const announcement = {
      text: response.message,
      type: response.success ? 'success' : 'error'
    }
    EventBus.$emit('announce', announcement)

    if (process.env.VUE_APP_MODE === 'development') {
      console.log(`mounted: OrgConnections`)
    }
  },
  methods: {
    async fetchOrgConnections () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}/connections`)
      return response.data
    },
  }
}
</script>