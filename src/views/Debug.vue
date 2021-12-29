<template>

  <v-card>
    <v-card-title>
      Debug Viewer
    </v-card-title>

    <v-tabs v-model="tab">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab key="id-token">Identity Token</v-tab>
      <v-tab key="access-token">Access Token</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="id-token">
        <v-card class="pa-6" color="blue lighten-5">
        <!-- <v-card elevation="2" outlined class="ma-3 pa-3"> -->
          <v-card-title>Identity Token</v-card-title>
          <v-divider></v-divider>

          <v-card class="pa-6">
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
          </v-card>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showIDToken = !showIDToken">
              {{ showIDToken ? 'Hide Token' : 'Show Token' }}
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-tab-item>

      <v-tab-item key="access-token">
        <v-card class="pa-6" color="blue lighten-5">
        <!-- <v-card elevation="2" outlined class="ma-3 pa-3"> -->
          <v-card-title>Access Token</v-card-title>
          <v-divider></v-divider>
          
          <v-card class="pa-6">
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
          </v-card>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showAccessToken = !showAccessToken">
              {{ showAccessToken ? 'Hide Token' : 'Show Token' }}
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
  name: 'Debug',
  metaInfo: {
    title: 'Debug',
  },
  data () {
    return {
      title: 'Debug',
      tab: null,
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
      return JSON.stringify(this.user).trim()
    },
    tokenJSON () {
      return JSON.stringify(this.accessTokenDecoded).trim()
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
    this.user = this.$auth.decodeToken(claims.__raw)

    // get the raw access token
    const accesstoken  = await this.$auth.getTokenSilently()
    this.accessToken = {
      header: accesstoken ? accesstoken.split('.')[0] : '',
      body: accesstoken ? accesstoken.split('.')[1] : '',
      signature: accesstoken ? accesstoken.split('.')[2] : ''
    }
    // decode the access token
    this.accessTokenDecoded = accesstoken ? this.$auth.decodeToken(accesstoken) : {}
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
