<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
            <div :is="componentName">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import { get } from '@/libraries/util-object'
import { screenOrientation } from '@/libraries/util-dom'

export default {
    components: {
        DesktopView: () => import('./layouts/Layout.vue'), 
        MobileView: () => import('./layouts/LayoutMobile.vue')
    },
    computed: {
        componentName() {
            return get(this.$store.state, 'layout.name') || 'desktop-view'
        }
    },
    beforeDestroy() {
        if (typeof window === 'undefined') { return false }
        window.removeEventListener('resize', this.onResize, { passive: true })
    },
    created() {
        const env = process.env.VUE_APP_ENV || process.env.NODE_ENV
        if (env === 'development') {
            console.time('loading-time')
            this.$nextTick(() => { 
                console.timeEnd('loading-time')
            })
        }
    },
    mounted() {
        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
    },
    methods: {
        onResize() {
            let name = null
            const width = window.innerWidth
            const height = window.innerHeight
            if (width < 600) {
                name = 'xs'
            } else if (width >= 600 && width < 960) {
                name = 'sm'
            } else if (width >= 960 && width < 1264) {
                name = 'md'
            } else if (width >= 1264 && width < 1904) {
                name = 'lg'
            } else if (width >= 1904) {
                name = 'xl'
            }
            this.$store.dispatch('breakpoint/updateName', name)
            this.$store.dispatch('breakpoint/updateOrientation', screenOrientation())
            this.$store.dispatch('breakpoint/updatePixels', { width, height })
        }
    }
}
</script>
