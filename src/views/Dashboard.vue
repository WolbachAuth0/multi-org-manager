<template>
<div>
  <announcer :visible="announcement.visible"
             :text="announcement.text"
             :type="announcement.type"
  ></announcer>

  <v-card>
    <v-card-title>
      {{ org.display_name }}
    </v-card-title>
  </v-card>

  <v-card>
    <v-card-title>
      Members
    </v-card-title>
    
    <v-card-title>
      <v-text-field v-model="table.search" append-icon="mdi-magnify" label="Search Organization Members ..." single-line hide-details></v-text-field>
    </v-card-title>

    <v-data-table :headers="table.headers" :items="members" :search="table.search">
      <template v-slot:item.picture="{ item }">
        <v-tooltip>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar>
              <img :src="item.picture" :alt="item.user_id">
            </v-avatar>
          </template>
          <span>user_id: {{ item.user_id }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

  </v-card>
</div>
</template>

<script>
import Announcer from '../components/Announcer.vue'
import { mdiAccountCircle } from '@mdi/js'

export default {
  components: { Announcer },
  name: 'Dashboard',
  data () {
    return {
      user: {},
      org: {},
      table: {
        search: '',
        headers: [
          { text: '', align: 'start', value: 'picture', filterable: false, sortable: false },
          // { text: 'ID', filterable: false, value: 'user_id' },
          { text: 'Name', value: 'name', filterable: true, sortable: true },
          { text: 'Email', value: 'email', filterable: true, sortable: true }
        ] 
      },
      members: [],
      
      announcement: {
        visible: false,
        text: '',
        type: 'success',
      },
      icons: {
        mdiAccountCircle,
      }
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

    const success = org.success && members.success
    this.announcement.type = success ? 'success' : 'error' 
    this.announcement.text = `${org.message}<br/>${members.message}`
    this.announcement.visible = true

    if (!success) {
      console.log(org.data, members.data)
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