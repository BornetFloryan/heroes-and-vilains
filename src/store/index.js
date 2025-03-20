import Vue from 'vue';
import Vuex from 'vuex';
import heroes from './heroes';
import teams from './teams';
import orgs from './orgs';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    secret: ''
  },
  mutations: {
    setSecret(state, secret) {
      state.secret = secret;
    }
  },
  actions: {
    setSecret({ commit }, secret) {
      commit('setSecret', secret);
    }
  },
  modules: {
    heroes,
    teams,
    orgs
  }
});