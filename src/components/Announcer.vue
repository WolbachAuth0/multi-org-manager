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
  mdiCloudAlert,
  mdiInformationOutline,
  mdiAlertOutline,
  mdiCommentOutline
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
      switch(this.type) {
        case 'success':
          return 'Success !'
        case 'error':
          return 'Error !'
        case 'warning':
          return 'Warning !'
        case 'info':
          return 'Note: '
        default:
          return 'Title'
      }
    },
    color () {
      switch(this.type) {
        case 'success':
          return 'success'
        case 'error':
          return 'error'
        case 'warning':
          return 'warning'
        case 'info':
          return 'info'
        default:
          return 'secondary'
      }
    },
    icon () {
      switch(this.type) {
        case 'success':
          return mdiCloudCheckOutline
        case 'error':
          return mdiCloudAlert
        case 'warning':
          return mdiAlertOutline
        case 'info':
          return mdiInformationOutline
        default:
          return mdiCommentOutline
      }
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
        return [ 'success', 'error', 'warning', 'info' ].indexOf(value) !== -1
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
