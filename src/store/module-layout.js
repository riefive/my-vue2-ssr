export default {
    namespaced: true,
    state: {
        name: 'default' // default (desktop) | mobile
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
