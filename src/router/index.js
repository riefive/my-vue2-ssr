import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/about', name: 'About', component: () => import('../views/About.vue') }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes.map(route => ({
        path: route.path,
        name: route.name,
        component: route.component,
        beforeEnter(to, from, next) {
            const breakpointName = store.state.breakpoint.name
            store.dispatch('layout/updateName', ['xs', 'sm'].includes(breakpointName) ? 'mobile-view' : 'desktop-view')
            next()
        }
    }))
})

export default router
