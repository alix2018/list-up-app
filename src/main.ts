import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// Vuetify
import 'vuetify/styles';
import './assets/base.css';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { VBtn } from 'vuetify/components/VBtn';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  aliases: {
    VBtn: VBtn,
    VBtnText: VBtn
  },
  defaults: {
    VBtn: {
      rounded: 'sm',
      elevation: 2,
      color: 'var(--color-dark-purple)',
      style: 'color: white;'
    },
    VBtnText: {
      variant: 'text',
      elevation: 0,
      color: 'var(--color-dark-purple)'
    }
  }
});

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount('#app');
