import Vue from 'vue';
import Vuex from 'vuex';
import heroes from './heroes';
import teams from './teams';
import orgs from './orgs';
import errors from './errors';
import secret from "@/store/secret";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    heroes,
    teams,
    orgs,
    errors,
    secret
  }
});