export default {
    namespaced: true,
    state: {
        name: 'default'
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
