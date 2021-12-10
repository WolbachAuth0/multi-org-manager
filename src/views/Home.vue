<template>
  <v-card>
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      Welcome to the Organization Manager. Please login to view the dashboard.
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      title: 'Home'
    }
  }
}
</script>