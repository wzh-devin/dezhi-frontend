import { createApp } from 'vue'
import './style.css'

// 配置重置样式
import 'normalize.css'
import './assets/css/index.less'

import App from './App.vue'
import router from './router'
import pinia from './store'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
