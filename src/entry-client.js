import { createApp } from './main'
import '@/assets/style.css'

const { app, router } = createApp()

router.onReady(() => {
    app.$mount('#app', true)
})