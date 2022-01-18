<template>
  <v-dialog v-model="isShown">
    <div class="d-flex justify-center">
      <v-card width="50%">
        <v-toolbar dark color="secondary">
          <v-card-title>
            Invite New Member
          </v-card-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn icon dark @click="isShown = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <!-- <v-card-text class="ma-5">
          (TODO: Build a form for creating a new invitation)
        </v-card-text> -->

        <v-row class="ma-5">
          <v-col cols="12">
            <v-card-title>
              Configure Application
            </v-card-title>

            <v-select
              v-model="application.selected"
              :hint="application.hint"
              :items="application.items"
              :item-text="application.itemText"
              :item-value="application.itemValue"
              :label="application.label"
              outlined
              persistent-hint
              return-object
              single-line
            ></v-select>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="ma-5">
          <v-card-title>
            Send Invites by Email
          </v-card-title>
          <v-card-text>
            You must specify an email address to send invitations. Optionally, you may specify the connection 
            you wish for users to accept the invitation with and the roles they should be assigned.
          </v-card-text>

          <v-col cols="4">
            <v-text-field
              :label="email.label"
              :placeholder="email.label"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-select
              v-model="connection.selected"
              :items="connection.items"
              :item-text="connection.itemText"
              :item-value="connection.itemValue"
              :label="connection.label"
              :disabled="connection.disabled"
              outlined
              return-object
              single-line
            ></v-select>
          </v-col> 

          <v-col cols="4">
            <v-select
              v-model="role.selected"
              :items="role.items"
              :item-text="role.itemText"
              :item-value="role.itemValue"
              :label="role.label"
              :disabled="role.disabled"
              outlined
              return-object
              single-line
            ></v-select>
          </v-col>        
        </v-row>

        <v-card-actions class="ma-5">
          <v-btn color="primary" @click="createInvitation">
            Send Invitation
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import EventBus from '../../helpers/eventBus.js'

export default {
  name: 'Invitation',
  data () {
    return {
      isShown: false,
      application: {
        hint: 'You may select any application that your organization has enabled.',
        label: 'Your Application',
        itemText: 'name',
        itemValue: 'id',
        selected: { name: '', id: null },
        items: [
          { name: 'TODO: Fetch Org-Enabled Applications from API', id: 'get-id'}
        ]
      },
      email: {
        disabled: true,
        label: 'Enter email address',
        itemText: 'email',
      },
      connection: {
        disabled: true,
        label: 'Select Enabled Connection',
        itemText: 'name',
        itemValue: 'id',
        selected: { name: '', id: null },
        items: [
          { name: 'TODO: Fetch Org Connections from API', id: 'get-id'}
        ]
      },
      role: {
        disabled: true,
        label: 'Select Roles',
        itemText: 'name',
        itemValue: 'id',
        selected: { name: '', id: null },
        items: [
          { name: 'TODO: Fetch Roles from API', id: 'get-id'}
        ]
      },
    }
  },
  props: {
    org: { type: Object },
    visible: { type: Boolean }
  },
  watch: {
    visible (newValue, oldValue) {
      this.isShown = newValue
      console.log('invitation: visible changed', newValue, oldValue)
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
    async createInvitation () {
      const announcement = {
        text: 'Creating invitations is not currently supported. Work in progress.',
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