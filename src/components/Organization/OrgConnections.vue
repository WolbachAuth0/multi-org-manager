<template>
  <v-card class="pa-6" color="blue lighten-5">
    <v-card-title>
      Connections
    </v-card-title>
    <v-card-text>
      These are all the identity providers for this organization. 
      They include databases, social network connections and enterprise connections like active directories.
    </v-card-text>
    
    <v-card class="pa-6" outlined>
      
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'OrgConnections',
  data () {
    return {}
  },
  async mounted () {   
    if (process.env.VUE_APP_MODE === 'development') {
      console.log(`mounted: OrgConnections`)
    }
  },
  methods: {
    
  }
}
</script>