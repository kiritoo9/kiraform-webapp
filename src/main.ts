// load css
import './assets/css/global.css'

// load main app
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import pinia from './pinia'
import router from './router'

// initiate app
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
