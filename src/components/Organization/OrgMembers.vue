<template>
  <v-card class="pa-6" color="blue lighten-5">
    <v-card-title>
      Members
    </v-card-title>
    <v-card-text>
      A list of all the current members of this organization.
    </v-card-text>
    
    <v-card class="pa-6">
      <v-card-title>
        <v-text-field v-model="table.search" append-icon="mdi-magnify" label="Search Organization Members ..." single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table :headers="table.headers" :items="members" :search="table.search">
        <template v-slot:[`item.picture`]="{ item }">
          <v-tooltip>
            <template v-slot:activator="{ }">
              <v-avatar>
                <img :src="item.picture" :alt="item.user_id">
              </v-avatar>
            </template>
            <span>user_id: {{ item.user_id }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script>
import { mdiAccountCircle } from '@mdi/js'
import EventBus from '../../helpers/eventBus.js'

export default {
  name: 'OrgMembers',
  data () {
    return {
      table: {
        search: '',
        headers: [
          { text: '', align: 'start', value: 'picture', filterable: false, sortable: false },
          { text: 'Name', value: 'name', filterable: true, sortable: true },
          { text: 'Email', value: 'email', filterable: true, sortable: true }
        ] 
      },
      members: [],
      icons: { mdiAccountCircle },
    }
  },
  async mounted () {
    const response = await this.fetchOrgMembers()
    this.members = response.data
    const announcement = {
      text: response.message,
      type: response.success ? 'success' : 'error'
    }
    EventBus.$emit('announce', announcement)

    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: OrgMembers')
      console.log(response.data)
    }
  },
  props: {
    org: { type: Object }
  },
  methods: {
    /**
     * Gets called when the component is mounted.
     * Fetches an array of users which are members of the organization.
     *
     * @async
     * @returns {Object[]} An array of users.  
     */
    async fetchOrgMembers () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}/members`)
      return response.data
    },
    // TODO: Implement the  stuff below
    async getMemberRoles (memberID) {},
    async addRolesToMember (memberID, roleID) {},
    async removeRolesFromMember (memberID, roleID) {},
    async removeMember (memberID) {},
  }
}
</script>