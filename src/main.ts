import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './css/element-variable.scss'
import './css/app.scss'
import 'animate.css'

const app = createApp(App).use(ElementPlus).use(store).use(router).mount('#app')

export default app
