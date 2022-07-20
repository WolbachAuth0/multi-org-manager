import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

/**
 * This plugin is here to handle color themes for the app.
 */
export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        background: colors.grey.darken5,
        surface: colors.grey.darken3,
        primary: colors.blue.lighten3,
        secondary: colors.blueGrey.darken2,
        info: colors.blueGrey.lighten3,
        accent: colors.cyan.accent4,
        success: colors.green.darken1,
        warning: colors.yellow.lighten4,
        error: colors.red.lighten4,
      },
      light: {
        background: colors.grey.lighten5,
        surface: colors.grey.lighten4,
        // primary: colors.red.darken1, // #E53935
        // secondary: colors.red.lighten4, // #FFCDD2
        // accent: colors.indigo.base,
        // info: colors.blueGrey.lighten3,
        // success: colors.green.lighten1,
        // warning: colors.yellow,
        // error: colors.red.darken3,
      },
    }
  },
  icons: {
    iconfont: 'mdiSvg'
  },
});
