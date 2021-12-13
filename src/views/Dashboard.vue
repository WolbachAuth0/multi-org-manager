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
          <v-icon x-large>{{ alert.icon }}</v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="10">
        {{ alert.text }}
      </v-col>
    </v-row>
  </v-snackbar>

  <v-card>
    <v-card-title>
      {{ title }}
    </v-card-title>
    
    <ul>
      <li v-for="member of members" :key="member.user_id">
        {{ member.name }}
      </li>
    </ul>


  </v-card>
</div>
</template>

<script>
import {
  mdiAccountCircle,
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
      },
      mdiAccountCircle
    }
  },
  async mounted () {
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted')
    }
    const org = await this.fetchOrg()
    const members = await this.fetchOrgMembers()
    this.org = org.data
    this.members = members.data
    console.log(org, members)
    if (org.success && members.success) {
      this.alert.title = 'Success !'
      this.alert.text = 'We fetched the data from the API.'
      this.alert.icon = mdiCloudCheckOutline
      this.alert.visible = true
    } else {
      this.alert.title = 'Warning !'
      this.alert.text = 'An Error occurred while access http resources.'
      this.alert.color = 'red'
      this.alert.icon = mdiCloudAlert
      this.alert.visible = true
    }
  },
  methods: {
    async fetchOrg () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}`)
      return response.data
    },
    async fetchOrgMembers () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}/members`)
      return response.data
    }
  }
}
</script>