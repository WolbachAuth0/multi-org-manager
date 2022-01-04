<template>
  <v-dialog v-model="isShown" max-width="50%">
    <v-card class="pa-6">
      <v-row v-if="user">
        <v-col cols="12">
          <v-card-title>
            {{ user.name }}
          </v-card-title>
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
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      
      <v-card-actions>
        <v-btn color="primary" @click="saveMember">
          Save
        </v-btn>
        <v-btn color="warning" @click="removeMember">
          Delete
        </v-btn>
        <v-btn color="error" @click="isShown = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'Member',
  data () {
    return {
      isShown: false,
      roles: [],
      loading: false,
      table: {
        headers: [
          { text: 'Name', value: 'name', filterable: true, sortable: true },
          { text: 'Description', value: 'description', filterable: true, sortable: true },
          { text: '', value: 'id', filterable: false, sortable: false },
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
        this.roles = response.data
        if (process.env.VUE_APP_MODE === 'development') {
          console.log('connection: visible changed', newValue, oldValue)
          console.log('fetched member roles')
          console.log(response.data)
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
  methods: {
    // TODO: Implement the  stuff below
    async getMemberRoles () {
      this.loading = true
      const url = `/organizations/${this.$auth.user.org_id}/members/${this.user.user_id}/roles`
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(url)
      this.loading = false
      return response.data
    },
    async saveMember () {
      console.log('You clicked the save button!')
    },
    async removeMember () {
      console.log('You clicked the delete button!')
    },
    // async addRolesToMember () {},
    // async removeRolesFromMember () {},
  }
}
</script>