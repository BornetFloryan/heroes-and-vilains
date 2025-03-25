import * as orgService from "@/services/org.service";

const state = {
    orgList: [],
    currentOrg: null,
};

const mutations = {
    setOrgList(state, orgs) {
        state.orgList = orgs;
    },
    setCurrentOrg(state, org) {
        state.currentOrg = org;
    },
};

const actions = {
    async fetchOrgList({ commit }) {
        try {
            let response = await orgService.getAllOrgsService();
            if (response.error === 0) {
                commit("setOrgList", response.data);
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des organisations', error);
            return { error: 1, data: 'Erreur lors de la récupération des organisations' };
        }
    },
    async createOrg({ dispatch }, { name, secret }) {
        try {
            let response = await orgService.createOrgService(name, secret);
            if (response.error === 0) {
                await dispatch("fetchOrgList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la création de l\'organisation', error);
            return { error: 1, data: 'Erreur lors de la création de l\'organisation' };
        }
    },
    async addTeamToOrg({ dispatch }, { idTeam }) {
        try {
            let response = await orgService.addTeamToOrgService(idTeam);
            if (response.error === 0) {
                await dispatch("fetchOrgList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'équipe à l\'organisation', error);
            return { error: 1, data: 'Erreur lors de l\'ajout de l\'équipe à l\'organisation' };
        }
    },
    async removeTeamFromOrg({ dispatch }, { idTeam }) {
        try {
            let response = await orgService.removeTeamFromOrgService(idTeam);
            if(response.error === 0) {
                await dispatch("fetchOrgList");
            }
            return response;
        } catch (error) {
            console.error('Erreur lors du retrait de l\'équipe de l\'organisation', error);
            return { error: 1, data: 'Erreur lors du retrait de l\'équipe de l\'organisation' };
        }
    },
    async fetchOrgById({ commit }, { id }) {
        try {
            let response = await orgService.getOrgByIdService(id);
            if (response.error === 0) {
                commit("setCurrentOrg", response.data[0]);
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'organisation', error);
            return { error: 1, data: 'Erreur lors de la récupération de l\'organisation' };
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};