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

        <template v-slot:[`item.user_id`]="{ item }">
          <v-btn icon @click="editMember(item)">
            <v-icon>mdi-pencil-circle-outline</v-icon>
          </v-btn>

        </template>
      </v-data-table>
    </v-card>

    <member :org="org"
            :visible="dialog"
            :user="selectedUser"
            @show="show"
		 				@hide="hide"
    ></member>
  </v-card>
</template>

<script>
import Member from './Member.vue'
import { mdiAccountCircle } from '@mdi/js'
import EventBus from '../../helpers/eventBus.js'

export default {
  name: 'OrgMembers',
  components: {
    Member
  },
  data () {
    return {
      dialog: false,
      table: {
        search: '',
        headers: [
          { text: '', align: 'start', value: 'picture', filterable: false, sortable: false },
          { text: 'Name', value: 'name', filterable: true, sortable: true },
          { text: 'Email', value: 'email', filterable: true, sortable: true },
          { text: '', value: 'user_id', filterable: false, sortable: false },
        ] 
      },
      members: [],
      selectedUser: null,
      icons: { mdiAccountCircle },
    }
  },
  async mounted () {
    const response = await this.fetchMembers()
    this.members = response.data
    const announcement = {
      text: response.message,
      type: response.success ? 'success' : 'error',
      top: true,
      right: true,
      left: false
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
    async fetchMembers () {
      const url = `/organizations/${this.$auth.user.org_id}/members`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(url)
      return response.data
    },
    editMember (member) {
      this.selectedUser = member
      this.show()
    },
    show () {
      this.dialog = true
    },
    hide () {
      this.dialog = false
    }
  }
}
</script>