<template>
<div>
  <v-card elevation="2" outlined class="ma-3 pa-3">
    <v-card-title>Identity Token</v-card-title>
    <v-divider></v-divider>
    <pre>{{ userJSON | pretty }}</pre>

    <!-- <highlightjs
      autodetect 
      :code="JSON.stringify($auth.user, null, 2)" 
      class="rounded w-100" 
      v-if="showIDToken"
    /> -->
  </v-card>

  <v-card elevation="2" outlined class="ma-3 pa-3">
    <v-card-title>Access Token</v-card-title>
    <v-divider></v-divider>
    <!-- <textarea v-model="tokenJSON" rows="8" cols="40"></textarea> -->
    <pre>{{ tokenJSON | pretty }}</pre>

    <!-- <highlightjs 
      autodetect 
      :code="JSON.stringify(accessToken, null, 2)" 
      class="rounded w-100"
      v-if="showAccessToken"
    /> -->
  </v-card>
</div>
</template>

<script>
export default {
  name: 'Debug',
  data () {
    return {
      title: 'Debug',
      showIDToken: true,
      showAccessToken: true,
      user: {},
      accessToken: {}
    }
  },
  computed: {
    userJSON () {
      return JSON.stringify(this.user)
    },
    tokenJSON () {
      return JSON.stringify(this.accessToken)
    }
  },
  filters: {
    pretty: function(value) {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
  },
  async beforeMount() {
    this.user = this.$auth.user
    const accesstoken  = await this.$auth.getTokenSilently()
    this.accessToken = parseJwt(accesstoken)
        
    function parseJwt(token) {
      const base64Payload = token.split('.')[1]
      const payload = Buffer.from(base64Payload, 'base64')
      return JSON.parse(payload.toString())
    }
  }
}
</script>