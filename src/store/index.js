import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import ModuleBreakpoint from './module-breakpoint'
import ModuleLayout from './module-layout'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['breakpoint', 'layout']
})

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
    plugins: [vuexLocal.plugin]
})
