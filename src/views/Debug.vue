<template>
  <div>
    <v-card elevation="2" outlined class="ma-3 pa-3">
      <v-card-title>Identity Token</v-card-title>
      <v-divider></v-divider>

      <v-row>
        <v-col cols="6">
          <code class="token" v-if="showIDToken">
            <span class="header">{{ idToken.header }}</span>
            <span>.</span>
            <span class="body">{{ idToken.body }}</span>
            <span>.</span>
            <span class="signature">{{ idToken.signature }}</span>
          </code>
        </v-col>

        <v-col cols="6">
          <pre class="json" v-if="showIDToken">
            {{ userJSON | pretty }}
          </pre>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" outlined @click="showIDToken = !showIDToken">
          {{ showIDToken ? 'Hide Token' : 'Show Token' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card elevation="2" outlined class="ma-3 pa-3">
      <v-card-title>Access Token</v-card-title>
      <v-divider></v-divider>
      
      <v-row>
        <v-col cols="6" >
          <code class="token" v-if="showAccessToken">
            <span class="header">{{ accessToken.header }}</span>
            <span>.</span>
            <span class="body">{{ accessToken.body }}</span>
            <span>.</span>
            <span class="signature">{{ accessToken.signature }}</span>
          </code>
        </v-col>

        <v-col cols="6">
          <pre class="json" v-if="showAccessToken">{{ tokenJSON | pretty }}</pre>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" outlined @click="showAccessToken = !showAccessToken">
          {{ showAccessToken ? 'Hide Token' : 'Show Token' }}
        </v-btn>
      </v-card-actions>
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
      idToken: '',
      user: {},
      accessToken: '',
      accessTokenDecoded: {}
    }
  },
  computed: {
    userJSON () {
      return JSON.stringify(this.user)
    },
    tokenJSON () {
      return JSON.stringify(this.accessTokenDecoded)
    }
  },
  filters: {
    pretty: function(value) {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
  },
  async beforeMount() {
    // get the raw id token
    const claims = await this.$auth.getIdTokenClaims()
    this.idToken = {
      header: claims.__raw.split('.')[0],
      body: claims.__raw.split('.')[1],
      signature: claims.__raw.split('.')[2]
    }
    // decode the id token
    this.user = this.$auth.user

    // get the raw access token
    const accesstoken  = await this.$auth.getTokenSilently()
    this.accessToken = {
      header: accesstoken ? accesstoken.split('.')[0] : '',
      body: accesstoken ? accesstoken.split('.')[1] : '',
      signature: accesstoken ? accesstoken.split('.')[2] : ''
    }
    // decode the access token
    this.accessTokenDecoded = accesstoken ? parseJwt(accesstoken) : {}
    
    function parseJwt(token) {
      const base64Payload = token.split('.')[1]
      const payload = Buffer.from(base64Payload, 'base64')
      return JSON.parse(payload.toString())
    }
  }
}
</script>

<style scoped>
  pre.json {
    font-family: monospace, monospace;
    display: block;
    overflow: scroll;
    padding: 0.5em;
    color: white;
    background: #282a36;
  }

  code.token {
    font-family: monospace, monospace;
    display: block;
    overflow-wrap: break-word;
    padding: 0.5em;
    color: white;
    background: #282a36;
    /* background-color: var(--v-background-base); */
  }

  code.token > span.header {
    color: red;
  }
  code.token > span.body {
    color: green;
  }
  code.token > span.signature {
    color: steelblue;
  }
</style>
