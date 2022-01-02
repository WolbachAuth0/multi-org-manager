<template>
  <v-snackbar v-model="isShown"
              :timeout="timeout"
              :top="top"
              :right="right"
              :bottom="bottom"
              :left="left"
              :centered="centered"
              :outlined="outlined"
              :color="color"
  >
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="isShown = false">
        Close
      </v-btn>
    </template>
    <v-row>
      <v-col cols="2">
        <v-avatar :color="color">
          <v-icon>
            {{ icon }}
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="10" v-html="text"></v-col>
    </v-row>
  </v-snackbar>
</template>

<script>
import {
  mdiCloudCheckOutline,
  mdiCloudAlert
} from '@mdi/js';

export default {
  name: 'Announcer',
  data () {
    return {
      outlined: false,
      isShown: false
    }
  },
  computed: {
    title () {
      return (this.type === 'success') ? 'Success !' : 'Error !'
    },
    color () {
      return (this.type === 'success') ? 'success' : 'error'
    },
    icon () {
      return (this.type === 'success') ? mdiCloudCheckOutline : mdiCloudAlert
    },
    bottom () {
      return !this.top
    },
    centered () {
      return !(this.right && this.left)
    }
  },
  props: {
    visible: { type: Boolean },
    text: { type: String, default: '' },
    timeout: { type: Number, default: 2000 },
    top: { type: Boolean, default: true },
    right: { type: Boolean, default: true },
    left: { type: Boolean, default: false },
    type: {
      validator (value) {
        return [ 'success', 'error' ].indexOf(value) !== -1
      }
    }
  },
  watch: {
    visible (newValue, oldValue) {
      this.isShown = newValue
    },
    isShown(newValue, oldValue) {
      if (newValue) {
        this.$emit('show', true)
      } else {
        this.$emit('hide', false)
      }
      
    }
  }
}
</script>
