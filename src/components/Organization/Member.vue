<template>
  <v-dialog v-model="isShown"
            max-width="50%"
  >
    <v-card class="pa-6">
      <v-avatar>
        <img :src="user.picture" :alt="user.user_id">
      </v-avatar>
      <br/>
      Name = {{ user.name }}<br/>
      Email = {{ user.email }}<br/>
      User ID= {{ user.user_id }}<br/>
      
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