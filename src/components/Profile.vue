<template>
  <v-card elevation="2" outlined>
    <v-img height="100%" src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg">
      <v-row align="end" class="fill-height">
        
        <v-col align-self="start" class="pa-0" cols="12">
          <v-avatar class="profile" color="grey" size="30%" tile>
            <v-img :src="user.picture"></v-img>
          </v-avatar>
        </v-col>
        
        <v-col class="py-0">
          <v-list-item color="rgba(0, 0, 0, .4)" dark>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ user.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      title: 'Profile',
    }
  },
  computed: {
    user () {
      return this.$auth.user
    }
  },
  mounted () {
    if (process.env.VUE_APP_MODE === 'development') {
      console.log(this.user)
    }
  }
}
</script>