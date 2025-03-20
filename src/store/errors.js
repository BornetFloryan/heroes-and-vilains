const state = {
    isError: false,
    errorMsg: '',
};

const mutations = {
    pushError(state, message) {
        state.isError = true;
        state.errorMsg = message;
    },
    popError(state) {
        state.isError = false;
        state.errorMsg = '';
    },
};

const actions = {
    pushError({ commit }, message) {
        commit('pushError', message);
    },
    popError({ commit }) {
        commit('popError');
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};