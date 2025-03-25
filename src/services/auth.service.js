import { postRequest, getRequest, putRequest } from "@/services/axios.service";

export async function signinFromAPI(login, password) {
    let data = { login, password };
    return postRequest('authapi/auth/signin', data, 'SIGNIN');
}

export async function getUserFromAPI(login) {
    return getRequest(`authapi/user/getuser/${login}`, 'GETUSER');
}

export async function updateHeroFromAPI(data) {
    return putRequest('herocorp/heroes/authupdate', data, 'UPDATEHERO');
}

export async function registerFromAPI(data) {
    return postRequest('authapi/user/register', data, 'REGISTER');
}

export async function signinService(login, password) {
    let response;
    try {
        response = await signinFromAPI(login, password);
    } catch (error) {
        response = { error: 1, status: 404, data: 'Erreur réseau, impossible de s\'authentifier' };
    }
    return response;
}

export async function getUserService(login) {
    let response;
    try {
        response = await getUserFromAPI(login);
    } catch (error) {
        response = { error: 1, status: 404, data: 'Erreur réseau, impossible de récupérer les données de l\'utilisateur' };
    }
    return response;
}

export async function updateHeroService({ _id, publicName, realName, powers }) {
    let response;
    try {
        let data = {
            _id: _id,
            publicName,
            realName,
            powers
        };
        response = await updateHeroFromAPI(data);
    } catch (error) {
        response = { error: 1, status: 404, data: 'Erreur réseau, impossible de mettre à jour le héros' };
    }
    return response;
}

export async function registerService(data) {
    let response;
    try {
        response = await registerFromAPI(data);
    } catch (error) {
        response = { error: 1, status: 404, data: 'Erreur réseau, impossible d\'enregistrer l\'utilisateur' };
    }
    return response;
}