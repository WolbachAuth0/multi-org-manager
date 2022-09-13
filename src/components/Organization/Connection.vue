<template>
  <v-dialog 
    width="40%"
    :value="dialog"
    @input="$emit('input', $event)"  
  >
    <div class="d-flex justify-center">
      <v-card width="100%">
        <v-toolbar dark color="secondary">
          <v-card-title>
            Enable New Connection
          </v-card-title>

          <v-spacer></v-spacer>
          
          <v-toolbar-items>
            <v-btn icon dark @click="close" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-title>OpenID Connect Connection</v-card-title>
        <v-card-subtitle>Instructions for creating an OIDC connection</v-card-subtitle>

        <div class="mx-3">
          <v-text-field v-model="oidc.connectionName.value"
                        :label="oidc.connectionName.label"
                        :hint="oidc.connectionName.hint"
                        outlined
                        clearable
                        persistent-hint>
          </v-text-field>
          
          <v-text-field v-model="oidc.issuerURL.value"
                        :label="oidc.issuerURL.label"
                        :hint="oidc.issuerURL.hint"
                        outlined
                        clearable
                        persistent-hint>
          </v-text-field>
          
          <v-text-field v-model="oidc.clientID.value"
                        :label="oidc.clientID.label"
                        :hint="oidc.clientID.hint"
                        outlined
                        clearable
                        persistent-hint>
          </v-text-field>
        </div>

        <v-card-subtitle>Callback URL</v-card-subtitle>
        <v-card-text>You may need to configure the OIDC Issuer with this callback URL:</v-card-text>
        <v-card-text>
        <pre>https://science-experiment.us.auth0.com/login/callback</pre>
        </v-card-text>
        <v-switch class="mx-3" v-model="oidc.syncUser.value" :label="oidc.syncUser.label" />

        <v-card-actions class="ma-5 justify-space-between">
          <v-btn color="primary" @click="createConnection">
            Create Connection
          </v-btn>

          <v-btn color="primary" @click="autofillConnection">
            Autofill Connection
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import EventBus from '../../helpers/eventBus.js'

export default {
  name: 'Connection',
  model: {
    prop: 'dialog',
    event: 'input'
  },
  props: {
    dialog: Boolean
  },
  data () {
    return {
      oidc: {
        syncUser: {
          value: true,
          label: 'Sync user\'s profile attributes at each login.'
        },
        connectionName: {
          value: '',
          hint: 'This is a logical identifier of the connection. This name cannot be changed.',
          label: 'Connection Name',
        },
        issuerURL: {
          value: '',
          hint: 'Enter the URL of the discovery document of the OpenID Connect provider you want to connect with.',
          label: 'Issuer URL',
        },
        clientID: {
          value: '',
          hint: 'Obtaining the Client ID differs across providers. Please check your provider\'s documentation.',
          label: 'Client ID',
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit("close-dialog")
    },
    async createConnection () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const { connectionName, issuerURL, clientID } = this.$data.oidc;
      const newConnection = {
        name: connectionName.value,
        strategy: 'oidc',
        options: {
          scope: 'openid profile email',
          client_id: clientID.value,
          discovery_url: issuerURL.value
        }
      }
      // try {
      //   const response = await this.$http(accesstoken).post(`/organizations/${orgID}/connections`, newConnection)

      // } catch (err) {

      // }
      this.$emit('submit-connection', newConnection)
      // this.$emit('close-dialog')
      
    },

    autofillConnection() {
      this.$data.oidc.connectionName.value = "just-a-regular-old-plumbus"
      this.$data.oidc.issuerURL.value = "sso-idp-experiments.us.auth0.com/.well-known/openid-configuration"
      this.$data.oidc.clientID.value = "6bFUw7nMJdCmSLi5yx8kPuMVaykKumUf"
    }
  }
}
</script>