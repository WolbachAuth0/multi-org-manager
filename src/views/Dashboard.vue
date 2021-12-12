<template>
<div>
  <v-snackbar v-model="alert.visible" :timeout="5000" top right :color="alert.color">
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="alert.visible = false">
        Close
      </v-btn>
    </template>
    <v-row>
      <v-col cols="2">
        <v-avatar color="primary">
          <v-icon x-large>{{ mdiAccountCircle }}</v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="10">
        {{ alert.text }}
      </v-col>
  </v-snackbar>

  <v-card>
    <v-card-title>
      {{ title }}
    </v-card-title>
    
  </v-card>
</div>
</template>

<script>
import {
  mdiCloudCheckOutline,
  mdiCloudAlert
} from '@mdi/js';

export default {
  name: 'Dashboard',
  data () {
    return {
      title: 'Dashboard',
      user: {},
      org: {},
      members: [],
      alert: {
        visible: false,
        title: 'Success !',
        text: '',
        color: 'green',
        icon: mdiCloudCheckOutline
      }
    }
  },
  async mounted () {
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted')
    }
    const org = await this.fetchOrg()
    const members = await this.fetchOrgMembers()
    console.log(org, members)
    if (!(org.data.success && members.data.success) ) {
      this.alert.title = 'Warning !'
      this.alert.text = 'An Error occurred while access http resources.'
      this.alert.icon = mdiCloudAlert
      this.alert.visible = true
    }
  },
  methods: {
    async fetchOrg () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}`)
      response.data
    },
    async fetchOrgMembers () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}/members`)
      response.data
    }
  }
}
</script>