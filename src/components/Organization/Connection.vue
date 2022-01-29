<template>
  <v-dialog v-model="isShown">
    <div class="d-flex justify-center">
      <v-card width="50%">
        <v-toolbar dark color="secondary">
          <v-card-title>
            Enable New Connection
          </v-card-title>

          <v-spacer></v-spacer>
          
          <v-toolbar-items>
            <v-btn icon dark @click="isShown = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-title>OpenID Connect Connection</v-card-title>
        <v-card-text class="ma-5">
          Instructions for creating an OIDC connection
        </v-card-text>

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
        <pre>https://science-experiment.us.auth0.com/login/callback</pre>

        <v-switch v-model="oidc.syncUser.value" :label="oidc.syncUser.label"
        ></v-switch>

        <v-card-actions class="ma-5">
          <v-btn color="primary" @click="createConnection">
            Create Connection
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
  data () {
    return {
      isShown: false,
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
  props: {
    org: { type: Object },
    visible: { type: Boolean }
  },
  watch: {
    visible (newValue, oldValue) {
      this.isShown = newValue
      console.log('connection: visible changed', newValue, oldValue)
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
    async createConnection () {
      const announcement = {
        text: 'Creating new connections is not currently supported. Work in progress.',
        type: 'info',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)
    },
  }
}
</script>