import * as authService from "@/services/auth.service";

const state = {
    user: null,
    isAuthenticated: false,
};

const mutations = {
    setUser(state, user) {
        state.user = user;
        state.isAuthenticated = !!user;
    },
    logout(state) {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("xsrfToken");
    },
};

const actions = {
    async signin({ commit }, { login, password }) {
        try {
            let response = await authService.signinService(login, password);
            if (response.error === 0) {
                commit("setUser", { login: response.data.name });
                localStorage.setItem("xsrfToken", response.data.xsrfToken);
            }
            return response;
        } catch (error) {
            console.error("Erreur d'authentification", error);
            return { error: 1, data: "Échec de l'authentification" };
        }
    },

    async getUser({ commit, state }) {
        try {
            if (!state.user) return;
            let response = await authService.getUserService(state.user.login);
            if (response.error === 0) {
                commit("setUser", response.data);
            }
            return response;
        } catch (error) {
            console.error("Erreur de récupération de l'utilisateur", error);
            return { error: 1, data: "Échec de récupération" };
        }
    },

    async updateHero(_, heroData) {
        try {
            let response = await authService.updateHeroService(heroData);
            return response;
        } catch (error) {
            console.error("Erreur de mise à jour du héros", error);
            return { error: 1, data: "Échec de mise à jour" };
        }
    },

    async register({ dispatch }, { login, password, hero, captchaToken }) {
        try {
            let response = await authService.registerService(login, password, hero, captchaToken);
            if (response.error === 0) {
                await dispatch("signin", { login, password });
            }
            return response;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
            return { error: 1, data: "Échec d'enregistrement" };
        }
    },

    logout({ commit }) {
        commit("logout");
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
