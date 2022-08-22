<template>
  <v-card :color="background" class="pa-6 ma-3">

    <v-card outlined raised class="pa-6 mx-6">
      <div class="d-flex justify-center my-2">
        <v-avatar tile v-if="logoIsAvailable">
          <v-img :src="logoURL" max-height="40" max-width="40" ></v-img>
        </v-avatar>
        <v-avatar tile v-else>
          <v-progress-circular :size="40" color="primary" indeterminate></v-progress-circular>
        </v-avatar>
      </div>

      <v-card-text class="text-center blue-grey lighten-4 my-2">
      </v-card-text>

      <v-card-subtitle class="justify-center blue-grey lighten-4 my-2">
      </v-card-subtitle>

      <v-card-subtitle class="justify-center blue-grey lighten-4 my-2">
      </v-card-subtitle>

      <v-card-subtitle class="justify-center blue-grey lighten-4 my-2">
      </v-card-subtitle>

      <v-card-text class="text-center blue-grey lighten-4 my-2">
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn :color="primary">
          <span class="purple lighten-5"></span>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card-text :class="fontClass">
      Mock UI Preview<br/>
      For organization branding representation only,<br/>
      any other customization will not visible.
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OrgSampleUi',
  data () {
    return {}
  },
  props: {
    logoURL: { type: String },
    primary: { type: String },
    background: { type: String }
  },
  computed: {
    logoIsAvailable () {
      return this.logoURL
    },
    fontClass () {
      const hex = this.background
      const l = this.computeLightness(hex)
      const classname = l <= 50 ? 'text-center white--text' : 'text-center black--text'
      return classname
    }
  },
  methods: {
    computeLightness (hex) {
      // parse the RGB value from the hex color
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      let r = parseInt(result[1], 16)/255
      let g = parseInt(result[2], 16)/255
      let b = parseInt(result[3], 16)/255

      // next compute the HSL "lightness" value 
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const l = Math.round((max + min) * 50)
      return l
    }
  }
}
</script>