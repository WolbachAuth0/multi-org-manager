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
      <v-tab key="portal">Member Portal</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="portal">
        <v-card class="pa-6" color="blue lighten-5">
          <v-card-title>
            Application
          </v-card-title>

        <v-card class="pa-6">
          <v-card-text>
            This is the place where members of the {{ orgNameIsAvailable ? org.display_name : 'organization' }} can interact 
            with their application.
          </v-card-text>

          </v-card>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    
  </v-card>
</template>

<script>
export default {
  name: 'Members',
  metaInfo: {
    title: 'Members Application',
  },
  data () {
    return {
      tab: 0,
      org: {},
      orgAvailable: false,
    }
  },
  async created () {
    const response = await this.fetchOrg()
    this.org = response.data
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Members')
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