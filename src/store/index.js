import Vue from 'vue'
import Vuex from 'vuex'
import ModuleBreakpoint from './module-breakpoint'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        breakpoint: ModuleBreakpoint
    }
})
