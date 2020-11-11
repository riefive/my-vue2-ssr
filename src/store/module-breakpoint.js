export default {
    namespaced: true,
    state: {
        name: 'xs', // mobile: [xs, sm] | desktop: [md, lg, xl]
        orientation: 'portrait', // portrait | landscape
        width: 0,
        height: 0
    },
    mutations: {
        changeName(state, value) {
            state.name = value
        },
        changeOrientation(state, value) {
            state.orientation = value
        },
        changePixels(state, value) {
            state.width = 'width' in value ? value.width : 0
            state.height = 'height' in value ? value.height : 0
        }
    },
    actions: {
        updateName({ commit }, value) {
            commit('changeName', value)
        },
        updateOrientation({ commit }, value) {
            commit('changeOrientation', value)
        },
        updatePixels({ commit }, value) {
            commit('changePixels', value)
        }
    }
}
