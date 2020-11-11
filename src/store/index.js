import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import ModuleBreakpoint from './module-breakpoint'
import ModuleLayout from './module-layout'

Vue.use(Vuex)

let plugins = []
if (process.browser) {
    const vuexLocal = new VuexPersistence({
        storage: window.localStorage,
        modules: ['breakpoint', 'layout']
    })
    plugins.push(vuexLocal.plugin)
}

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        breakpoint: ModuleBreakpoint,
        layout: ModuleLayout
    },
    plugins
})
