<template>
  <v-card class="pa-4">
    <v-row>
      <v-col cols="6">
        <v-card-title>
          Basic Info
        </v-card-title>
      </v-col>

      <v-col cols="6">
        <v-text-field v-model="org.name" :label="labels.name" :hint="hints.name"></v-text-field>
        <v-text-field v-model="org.display_name" :label="labels.display_name" :hint="hints.display_name"></v-text-field>
      </v-col>

    </v-row>
    
    


  </v-card>
</template>

<script>
export default {
  name: 'Organization',
  data () {
    return {
      labels: {
        name: 'Name',
        display_name: 'Display Name'
      },
      hints: {
        name: 'This is any human-readable identifier for the organization that will be used by end-users to direct them to their organization in your application.',
        display_name: 'If set, this is the name that will be displayed to end-users for this organization in any interaction with them.'
      },
      org: {
        // id: 'org_DnITNWXfRvtMKNu6',
        // name: 'circle-org',
        // display_name: 'Organization of Circular Things',
        // branding: {
        //   logo_url: 'https://cdn.worldvectorlogo.com/logos/puppet.svg',
        //   colors: {
        //     primary: '#7C64A5',
        //     page_background: '#322D6B'
        //   }
        // },
        // metadata: {
        //   shape: 'circle'
        // }
      }
    }    
  },
  async mounted () {
    const response = await this.fetchOrg()
    this.org = response.data
    const announcement = {
      text: response.message,
      type: response.success ? 'success' : 'error'
    }
    this.$emit('announcement', announcement)

    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Organization', response)
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