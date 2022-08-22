import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)
const okta = {
  lightblue: colors.blue.darken4,
  darkblue: '#151a66',
}

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        surface: colors.grey.darken2,
        primary: colors.blue.lighten3,
        secondary: colors.blueGrey.darken4,
        info: colors.blueGrey.lighten3,
        accent: colors.cyan.accent4,
        success: colors.green.darken1,
        warning: colors.yellow.lighten4,
        error: colors.red.lighten4,
      },
      light: {
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
