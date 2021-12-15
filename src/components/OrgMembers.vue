<template>
  <v-card>
    <v-card-title>
      Members
    </v-card-title>
    
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
</template>

<script>
import { mdiAccountCircle } from '@mdi/js'

export default {
  name: 'OrgMembers',
  data () {
    return {
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
      icons: { mdiAccountCircle },
    }
  },
  async mounted () {
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: OrgMembers')
    }
    const response = await this.fetchOrgMembers()
    this.members = response.data
    console.log(response.data)
  },
  methods: {
    async fetchOrgMembers () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}/members`)
      return response.data
    }
  }
}
</script>