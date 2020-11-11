<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <router-view/>
    </div>
</template>

<script>
import { screenOrientation } from '@/libraries/util-dom'

export default {
    beforeDestroy() {
        if (typeof window === 'undefined') { return false }
        window.removeEventListener('resize', this.onResize, { passive: true })
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

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
