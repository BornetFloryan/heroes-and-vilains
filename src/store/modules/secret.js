const state = {
    secret: ''
};

const mutations = {
    setSecret(state, secret) {
        state.secret = secret;
    }
};

const actions = {
    setSecret({ commit }, secret) {
        commit('setSecret', secret);
    },
};

const getters = {
    secret: state => state.secret
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};