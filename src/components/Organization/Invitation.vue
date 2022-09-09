<template>
  <v-dialog v-model="isShown">
    <div class="d-flex justify-center">
      <v-card width="50%">
        <v-toolbar dark color="secondary">
          <v-card-title>
            Invite New Member
          </v-card-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn icon dark @click="isShown = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-row class="ma-5">
          <v-card-title>
            Send Invites by Email
          </v-card-title>
          <v-card-text>
            You must specify an email address to send invitations. Optionally, you may specify the connection 
            you wish for users to accept the invitation with and the roles they should be assigned.
          </v-card-text>

          <v-col cols="4">
            <v-text-field
              v-model="email.value"
              :label="email.label"
              :placeholder="email.label"
              :rules="[rules.required, rules.email]"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-select
              v-model="connection.selected"
              :items="connection.items"
              :item-text="connection.itemText"
              :item-value="connection.itemValue"
              :label="connection.label"
              :disabled="connection.disabled"
              outlined
              return-object
              single-line
            ></v-select>
          </v-col> 

          <v-col cols="4">
            <v-select
              v-model="role.selected"
              :items="role.items"
              :item-text="role.itemText"
              :item-value="role.itemValue"
              :label="role.label"
              :disabled="role.disabled"
              outlined
              chips
              return-object
              single-line
              multiple
            ></v-select>
          </v-col>        
        </v-row>

        <v-card-actions class="ma-5">
          <v-btn color="primary" @click="createInvitation" :disabled="!isValidInput">
            Send Invitation
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import EventBus from '../../helpers/eventBus.js'

export default {
  name: 'Invitation',
  data () {
    return {
      isShown: false,
      orgRoles: [],
      email: {
        disabled: false,
        label: 'Enter email address',
        value: null,
      },
      connection: {
        disabled: false,
        label: 'Select Enabled Connection',
        itemText: 'name',
        itemValue: 'id',
        selected: { name: '', id: null },
        items: []
      },
      role: {
        disabled: false,
        label: 'Select Roles',
        itemText: 'name',
        itemValue: 'id',
        selected: [],
        items: []
      },
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
    }
  },
  async mounted () {
    const orgConnections = await this.fetchOrgConnections()
    const orgRoles = await this.getAllRoles()

    this.role.items = orgRoles.data.map(x => x.name)
    this.orgRoles = orgRoles.data
    this.connection.items = orgConnections.data.map(x => {
      return { name: x.connection.name, id: x.connection_id }
    })
  },
  computed: {
    isValidInput () {
      const connectionIsPresent = !!this.connection.selected.id
      const emailIsPresent = !!this.email.value
      const emailIsValid = this.rules.email(this.email.value) !== 'Invalid e-mail.'
      return emailIsPresent && emailIsValid && connectionIsPresent
    },
  },
  props: {
    org: { type: Object },
    visible: { type: Boolean }
  },
  watch: {
    visible (newValue, oldValue) {
      this.isShown = newValue
    },
    isShown(newValue, oldValue) {
      if (newValue) {
        this.$emit('show', true)
      } else {
        this.$emit('hide', false)
      }
    }
  },
  methods: {
    async fetchOrgConnections () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}/connections`)
      return response.data
    },
    async getAllRoles () {
      const url = `/roles`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(url)
      return response.data
    },
    async createInvitation () {
      const roleIds = this.orgRoles
        .filter(x => this.role.selected.includes(x.name))
        .map(x => x.id)

      const body = {
        inviter: { name: this.$auth.user.name },
        invitee: { email: this.email.value },
        client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
        connection_id: this.connection.selected.id,
        ttl_sec: 93600, // 36 hours
        roles: roleIds,
        send_invitation_email: true
      }

      const url = `/organizations/${this.$auth.user.org_id}/invitations`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).post(url, body)
      
      if (process.env.VUE_APP_MODE === 'development') {
        console.log('create invitation response', response.data)
      }
      
      const announcement = {
        text: response.data.message,
        type: response.data.success ? 'success' : 'error',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)

      this.isShown = false
    },
  }
}
</script>
