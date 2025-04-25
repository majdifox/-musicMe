// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Configure Vuetify with Apple Music-inspired themes
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#000000',
          'primary-darken-1': '#1A1A1A',
          secondary: '#FF2D55',
          'secondary-darken-1': '#D30F45',
          pink: '#FF2D55',
          error: '#FF3B30',
          info: '#007AFF',
          success: '#34C759',
          warning: '#FF9500',
          background: '#F9F9FB',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#FFFFFF',
          'primary-darken-1': '#E0E0E0',
          secondary: '#FF375F',
          'secondary-darken-1': '#FF5E80',
          pink: '#FF375F',
          error: '#FF453A',
          info: '#0A84FF',
          success: '#30D158',
          warning: '#FF9F0A',
          background: '#1A1A1A',
        }
      }
    }
  }
})

createApp(App)
  .use(vuetify)
  .mount('#app')