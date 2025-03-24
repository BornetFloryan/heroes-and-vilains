import * as heroService from "@/services/hero.service";

const state = {
    heroList: [],
    currentHero: null,
};

const mutations = {
    setHeroList(state, heroes) {
        state.heroList = heroes;
    },
    setCurrentHero(state, hero) {
        state.currentHero = hero;
    },
};

const actions = {
    async fetchHeroList({ commit }) {
        try {
            let response = await heroService.getAllHeroesService();
            if(response.error === 0) {
                commit("setHeroList", response.data);
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des héros', error);
            return { error: 1, data: 'Erreur lors de la récupération des héros' };
        }
    },
    async fetchHeroById({ commit }, { id, secret }) {
        try {
            let response = await heroService.getHeroByIdService(id, secret);
            if(response.error === 0){
                commit("setCurrentHero", response.data);
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération du héros', error);
            return { error: 1, data: 'Erreur lors de la récupération du héros' };
        }
    },
    async createHero({ dispatch }, heroData) {
        try {
            let response = await heroService.createHeroService(heroData.publicName, heroData.realName, heroData.powers);
            if(response.error === 0){
                await dispatch("fetchHeroList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la création du héros', error);
            return { error: 1, data: 'Erreur lors de la création du héros' };
        }
    },
    async updateHero({ dispatch }, { _id, publicName, realName, powers, secret }) {
        try {
            let response = await heroService.updateHeroService(_id, publicName, realName, powers, secret);
            if(response.error === 0){
                await dispatch("fetchHeroList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du héros', error);
            return { error: 1, data: 'Erreur lors de la mise à jour du héros' };
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};