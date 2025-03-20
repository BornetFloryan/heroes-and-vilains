import { getRequest, postRequest, patchRequest } from "@/services/axios.service";

export async function getAllTeamsFromAPI() {
    return getRequest('/teams/get', 'GETALLTEAMS');
}

export async function createTeamFromAPI(name) {
    let data = { name: name };
    return postRequest('/teams/create', data, 'CREATETEAM');
}

export async function addHeroesToTeamFromAPI(idTeam, idHeroes) {
    let data = { idHeroes: [idHeroes], idTeam: idTeam };
    console.log(data)
    return patchRequest('/teams/addheroes', data, 'ADDHEROESTOTEAM');
}

export async function removeHeroesFromTeamFromAPI(idTeam, idHeroes) {
    let data = { idHeroes: [idHeroes], idTeam: idTeam };
    return patchRequest('/teams/removeheroes', data, 'REMOVEHEROESFROMTEAM');
}


export async function getAllTeamsService() {
    let response;
    try {
        response = await getAllTeamsFromAPI();
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les équipes' };
    }
    return response;
}

export async function createTeamService(name) {
    let response;
    try {
        response = await createTeamFromAPI(name);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de créer une équipe' };
    }
    return response;
}

export async function addHeroesToTeamService(idTeam, idHeroes) {
    let response;
    try {
        response = await addHeroesToTeamFromAPI(idTeam, idHeroes);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible d\'ajouter des héros à l\'équipe' };
    }
    return response;
}

export async function removeHeroesFromTeamService(idTeam, idHeroes) {
    let response;
    try {
        response = await removeHeroesFromTeamFromAPI(idTeam, idHeroes);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de retirer des héros de l\'équipe' };
    }
    return response;
}