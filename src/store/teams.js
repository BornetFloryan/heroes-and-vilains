import * as teamService from "@/services/team.service";
import teamList from "@/views/TeamList.vue";

const state = {
    teamList: [],
    currentTeam: null,
};

const mutations = {
    setTeamList(state, teams) {
        state.teamList = teams;
    },
    setCurrentTeam(state, team) {
        state.currentTeam = team;
    },
};

const actions = {
    async fetchTeamList({ commit }) {
        try {
            let response = await teamService.getAllTeamsService();
            if(response.error === 0){
                commit("setTeamList", response.data);
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes', error);
            return { error: 1, data: 'Erreur lors de la récupération des équipes' };
        }
    },
    async createTeam({ dispatch }, teamName) {
        try {
            let response = await teamService.createTeamService(teamName);
            if(response.error === 0){
                await dispatch("fetchTeamList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la création de l\'équipe', error);
            return { error: 1, data: 'Erreur lors de la création de l\'équipe' };
        }
    },
    async addHeroesToTeam({ dispatch }, { idTeam, idHeroes }) {
        try {
            let response = await teamService.addHeroesToTeamService(idTeam, idHeroes);
            if(response.error === 0){
                await dispatch("fetchTeamList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de l\'ajout des héros à l\'équipe', error);
            return { error: 1, data: 'Erreur lors de l\'ajout des héros à l\'équipe' };
        }
    },
    async removeHeroesFromTeam({ dispatch }, { idTeam, idHeroes }) {
        try {
            let response = await teamService.removeHeroesFromTeamService(idTeam, idHeroes);
            if(response.error === 0){
                await dispatch("fetchTeamList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors du retrait des héros de l\'équipe', error);
            return { error: 1, data: 'Erreur lors du retrait des héros de l\'équipe' };
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};