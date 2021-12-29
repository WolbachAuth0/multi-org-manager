<template>
  <v-dialog v-model="isShown">
    <v-card class="pa-6">

      (TODO: Create a form for creating a new connection)

      <v-card-actions>
        <v-btn color="primary" @click="createConnection">
          Create Connection
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
  name: 'Connection',
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
      console.log('You clicked the button!')
    },
  }
}
</script>