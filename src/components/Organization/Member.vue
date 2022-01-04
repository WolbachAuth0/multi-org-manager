<template>
  <v-dialog v-model="isShown" >
    <div class="d-flex justify-center">
      <v-card width="50%">
        <v-toolbar dark color="secondary">
          <v-card-title v-if="user && user.name">
            {{ user.name }}
          </v-card-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn icon dark @click="isShown = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-row v-if="user">
          <v-col cols="12">
            <v-list three-line>
              <v-list-item key="1">
                <v-list-item-avatar>
                  <v-img :src="user.picture"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="user.email"></v-list-item-title>
                  <v-list-item-subtitle>user ID: {{user.user_id}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card-title>
              Assigned Roles
            </v-card-title>
            <v-data-table :headers="table.headers" :items="roles" hide-default-footer>
              <template v-slot:[`item.id`]="{ item }">
                <v-checkbox v-model="item.assigned" :disabled="!canEdit"></v-checkbox>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        
        <v-card-actions>
          <v-btn color="primary" @click="saveMember">
            Add Roles
          </v-btn>
          <v-btn color="error" @click="removeMember">
            Remove Member
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import EventBus from '../../helpers/eventBus.js'

export default {
  name: 'Member',
  data () {
    return {
      isShown: false,
      roles: [],
      loading: false,
      canEdit: true,
      table: {
        headers: [
          { text: 'Role', value: 'name', filterable: true, sortable: true },
          { text: 'Description', value: 'description', filterable: true, sortable: true },
          { text: 'Is Assigned', value: 'id', filterable: false, sortable: false },
        ] 
      },
    }
  },
  props: {
    org: { type: Object },
    visible: { type: Boolean },
    user: { type: Object }
  },
  watch: {
    async visible (newValue, oldValue) {
      if (newValue) {
        const response = await this.getMemberRoles()
        const assignedRoles = response.data
        this.roles = this.roles.map(role => {
          const found = assignedRoles.find(x => x.id === role.id)
          role.assigned = found ? true : false
          return role
        })

        if (process.env.VUE_APP_MODE === 'development') {
          console.log('connection: visible changed', newValue, oldValue)
          console.log('fetched member roles')
          console.log(this.roles)
        }
      }
      
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
  async mounted () {
    const response = await this.getAllRoles()
    this.roles = response.data.map(role => {
      role.assigned = false
      return role
    })
  },
  methods: {
    async getMemberRoles () {
      this.loading = true
      const url = `/organizations/${this.$auth.user.org_id}/members/${this.user.user_id}/roles`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(url)
      this.loading = false
      return response.data
    },
    async getAllRoles () {
      const url = `/roles`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(url)
      return response.data
    },
    async saveMember () {
      const addResponse = await this.addRolesToMember()
      const removeResponse = await this.removeRolesFromMember()

      const announcement = {
        text: addResponse.message + ' ' + removeResponse.message,
        type: addResponse.success && removeResponse.success ? 'success' : 'error',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)

      this.isShown = false
    },
    async removeMember () {
      const announcement = {
        text: 'Removing members is not currently supported. Work in progress.',
        type: 'info',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)
    },
    async addRolesToMember () {
      const url = `/organizations/${this.$auth.user.org_id}/members/${this.user.user_id}/roles`
      const accesstoken = await this.$auth.getTokenSilently()
      const body = {
        roles: this.roles.filter(role => role.assigned).map(role => role.id)
      }
      console.log('add roles request body:', body)
      if (body.roles.length > 0) {
        const response = await this.$http(accesstoken).post(url, body)
        return response.data
      } else {
        return { success: true, message: 'There were no roles to add to this user.' }
      }
    },
    async removeRolesFromMember () {
      const url = `/organizations/${this.$auth.user.org_id}/members/${this.user.user_id}/roles`
      const accesstoken = await this.$auth.getTokenSilently()
      const body = {
        roles: this.roles.filter(role => !role.assigned).map(role => role.id)
      }
      console.log('remove roles request body:', body)
      if (body.roles.length > 0) {
        const response = await this.$http(accesstoken).delete(url, body)
        return response.data
      } else {
        return { success: true, message: 'There were no roles to remove from this user.' }
      }
    },
  }
}
</script>