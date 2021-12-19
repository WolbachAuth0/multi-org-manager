<template>
  <v-card class="pa-6" color="blue lighten-5">
    <v-card-title>
      Invitations
    </v-card-title>
    <v-card-text>
      A list of invitations to users to join this organization.
    </v-card-text>
    
    <v-card class="pa-6" outlined>
      
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'OrgInvitations',
  data () {
    return {}
  },
  async mounted () {   
    if (process.env.VUE_APP_MODE === 'development') {
      console.log(`mounted: OrgInvitations`)
      console.log(response.data)
    }
  },
  methods: {
    
  }
}
</script>