<template>
  <v-dialog v-model="isShown">
    <v-card class="pa-6">

      (TODO: Build a form for creating a new invitation)

      <v-card-actions>
        <v-btn color="primary" @click="createInvitation">
          Invite Member
        </v-btn>
        <v-btn color="error" @click="isShown = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

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
      console.log('You clicked the button!')
    },
  }
}
</script>