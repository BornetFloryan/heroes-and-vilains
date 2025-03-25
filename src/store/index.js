import Vue from 'vue';
import Vuex from 'vuex';
import heroes from './modules/heroes';
import teams from './modules/teams';
import orgs from './modules/orgs';
import errors from './modules/errors';
import secret from "@/store/modules/secret";
import auth from "@/store/modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    heroes,
    teams,
    orgs,
    errors,
    secret,
    auth
  }
});