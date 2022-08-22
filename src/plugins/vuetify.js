import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)
const okta = {
  blue: '#07297a',
  lightblue: colors.blue.darken4, // '#0D47A1', // '#007DC1',
  darkblue: '#151a66',
  grey: '#757892',
  lightgrey: '#e4e5ed'
}

const defaults = {
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
}

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        background: colors.grey.darken2,
        surface: colors.grey,
        primary: colors.blue.lighten3,
        secondary: colors.blueGrey.darken4,
        info: colors.blueGrey.lighten3,
        accent: colors.cyan.accent4,
        success: colors.green.darken1,
        warning: colors.yellow.lighten4,
        error: colors.red.lighten4,
      },
      light: {
        // background: colors.grey.lighten5,
        surface: colors.blue.lighten5,
        primary: okta.darkblue,
        secondary: okta.lightblue,
        accent: colors.blue.base,
        lightgrey: okta.lightgrey,
        darkgrey: okta.darkgrey
      }
    }
  },
  icons: {
    iconfont: 'mdiSvg'
  },
});
