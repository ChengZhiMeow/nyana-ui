import { createApp } from 'vue'

import NyanaUI from '@chengzhimeow/nyana-ui'

import App from './App.vue'
import router from './router'
import { initTheme } from './theme'

import './styles/example.scss'

createApp(App).use(NyanaUI).use(router).mount('#app')

initTheme()
