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

        <v-card-text>
          (TODO: Build a form for creating a new invitation)
        </v-card-text>

        <v-card-actions>
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
      isShown: false
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