export default {
    namespaced: true,
    state: {
        name: 'desktop-view' // desktop-view | mobile-view
    },
    mutations: {
        changeName(state, value) {
            state.name = value
        }
    },
    actions: {
        updateName({ commit }, value) {
            commit('changeName', value)
        }
    }
}
