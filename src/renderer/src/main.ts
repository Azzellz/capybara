import './assets/css/main.css'
import 'virtual:uno.css'
import 'animate.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).mount('#app')
