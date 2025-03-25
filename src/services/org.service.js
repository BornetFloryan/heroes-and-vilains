import { getRequest, postRequest, patchRequest } from "@/services/axios.service";

export async function getAllOrgsFromAPI() {
    return getRequest('herocorp/orgs/get', 'GETALLORGS');
}

export async function createOrgFromAPI(name, secret) {
    let data = { name: name, secret: secret };
    return postRequest('herocorp/orgs/create', data, 'CREATEORG');
}

export async function addTeamToOrgFromAPI(idTeam) {
    let data = { idTeam: idTeam };
    return patchRequest('herocorp/orgs/addteam', data, 'ADDTEAMTOORG');
}

export async function removeTeamFromOrgFromAPI(idTeam) {
    let data = { idTeam: idTeam };
    return patchRequest('herocorp/orgs/removeteam', data, 'REMOVETEAMFROMORG');
}

export async function getOrgByIdFromAPI(id,) {
    return getRequest(`herocorp/orgs/getbyid/${id}`, 'GETORG');
}



export async function getAllOrgsService() {
    let response;
    try {
        response = await getAllOrgsFromAPI();
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les organisations' };
    }
    return response;
}

export async function createOrgService(name, secret) {
    let response;
    try {
        response = await createOrgFromAPI(name, secret);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de créer une organisation' };
    }
    return response;
}

export async function addTeamToOrgService(idTeam) {
    let response;
    try {
        response = await addTeamToOrgFromAPI(idTeam);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible d\'ajouter une équipe à l\'organisation' };
    }
    return response;
}

export async function removeTeamFromOrgService(idTeam) {
    let response;
    try {
        response = await removeTeamFromOrgFromAPI(idTeam);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de retirer une équipe de l\'organisation' };
    }
    return response;
}

export async function getOrgByIdService(id) {
    let response;
    try {
        response = await getOrgByIdFromAPI(id);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer l\'organisation' };
    }
    return response;
}