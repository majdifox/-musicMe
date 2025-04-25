import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#FF5722', // deep-orange
          secondary: '#607D8B',
          accent: '#FF9800',
          error: '#F44336',
          warning: '#FFC107',
          info: '#2196F3',
          success: '#4CAF50'
        },
      },
      dark: {
        colors: {
          primary: '#FF5722', 
          secondary: '#78909C',
          accent: '#FFA726',
          error: '#EF5350',
          warning: '#FFD54F',
          info: '#42A5F5',
          success: '#66BB6A'
        },
      },
    },
  },
})

createApp(App)
  .use(vuetify)
  .mount('#app')