<template>
  <v-card class="pa-6" color="surface">
    <v-card-title>
      Invitations
    </v-card-title>
    <v-card-text>
      Invite users to become members of your organization. 
      <a href="https://auth0.com/docs/organizations/configure/send-membership-invitations">Learn More</a>
    </v-card-text>
    
    <v-card class="pa-6">
      <!-- <v-card-title>
        <v-text-field v-model="table.search" append-icon="mdi-magnify" label="Search Organization Members ..." single-line hide-details></v-text-field>
      </v-card-title> -->

      <v-data-table :headers="table.headers" :items="invitations" :search="table.search">
        <template v-slot:[`item.email`]="{ item }">
          <v-avatar size="40" color="info">
            <span>{{ item.invitee.email[0].toUpperCase() }}</span>
          </v-avatar>
          {{ item.invitee.email }}
        </template>

        <template v-slot:[`item.ticket_id`]="{ item }">
          <v-chip v-if="isExpired(item.expires_at)" color="error" outlined>
            Expried
          </v-chip>
          <v-chip v-else color="success" outlined>
            Pending
          </v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.created_at | formatdate }}
        </template>

        <template v-slot:[`item.expires_at`]="{ item }">
          {{ item.expires_at | formatdate }}
        </template>

        <template v-slot:[`item.id`]="{ item }">
          <v-menu top :close-on-click="closeOnClick">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-btn @click="copyInvitationURL(item)">
                  Copy Invitation URL
                </v-btn>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-btn class="red--text" @click="revokeInvitation(item)">
                  <v-icon>mdi-delete-outline</v-icon>
                  Revoke Invitation
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>

        </template>
      </v-data-table>
    </v-card>

    <v-card-actions>
      <v-btn color="primary" @click="inviteMembers">
        Invite Members
      </v-btn>
    </v-card-actions>

    <invitation :org="org"
                :visible="dialog"
                @show="show"
		 					  @hide="hide"
    ></invitation>
  </v-card>
</template>

<script>
import Invitation from './Invitation.vue'
import EventBus from '../../helpers/eventBus.js'
import moment from 'moment'

export default {
  name: 'OrgInvitations',
  components: {
    Invitation
  },
  data () {
    return {
      dialog: false,
      invitations: [],
      table: {
        search: '',
        headers: [
          { text: 'Email', value: 'email', filterable: true, sortable: true },
          { text: 'Status', value: 'ticket_id', filterable: true, sortable: true },
          { text: 'Created At', value: 'created_at', filterable: false, sortable: true },
          { text: 'Expires At', value: 'expires_at', filterable: false, sortable: true },
          { text: 'Invited By', value: 'inviter.name', filterable: true, sortable: true },
          { text: '', value: 'id', filterable: false, sortable: false },
        ]
      }
    }
  },
  async mounted () {
    const response = await this.fetchInvitations()
    this.invitations = response.data
    const announcement = {
      text: response.message,
      type: response.success ? 'success' : 'error',
      top: true,
      right: true,
      left: false
    }
    EventBus.$emit('announce', announcement)

    if (process.env.VUE_APP_MODE === 'development') {
      console.log(`mounted: OrgInvitations`, response.data)
    }
  },
  props: {
    org: { type: Object }
  },
  filters: {
    formatdate (value) {
      if (value) {
        return moment(String(value)).format("MMM DD, YYYY hh:mm A")
      }
    }
  },
  methods: {
    async fetchInvitations () {
      const url = `/organizations/${this.$auth.user.org_id}/invitations`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(url)
      return response.data
    },
    isExpired (datestring) {
      return moment().isAfter(datestring)
    },
    async refreshData () {
      const response = await this.fetchInvitations()
      this.invitations = response.data
    },
    show () {
      this.dialog = true
    },
    hide () {
      this.dialog = false
      this.refreshData()
    },
    inviteMembers () {
      // show modal form with invitation detail
      this.dialog = true
    },
    copyInvitationURL (item) {
      navigator.clipboard.writeText(item.invitation_url)

      const announcement = {
        text: `Copied Invitation URL to Clipboard</br></br>${item.invitation_url}`,
        type: 'success',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)
    },
    async revokeInvitation (item) {
      const url = `/organizations/${this.$auth.user.org_id}/invitations/${item.id}`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).delete(url)
      
      if (process.env.VUE_APP_MODE === 'development') {
        console.log(response.data)
      }
      
      const announcement = {
        text: response.data.message,
        type: response.data.success ? 'success' : 'error',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)

      this.refreshData()
    }
  }
}
</script>