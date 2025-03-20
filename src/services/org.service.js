import { getRequest, postRequest, patchRequest } from "@/services/axios.service";

export async function getAllOrgsFromAPI() {
    return getRequest('/orgs/get', 'GETALLORGS');
}

export async function createOrgFromAPI(name, secret) {
    let data = { name: name, secret: secret };
    return postRequest('/orgs/create', data, 'CREATEORG');
}

export async function addTeamToOrgFromAPI(idTeam, orgSecret) {
    let data = { idTeam: idTeam };
    const config = {
        headers: {
            'org-secret': orgSecret
        }
    };
    return patchRequest('/orgs/addteam', data, 'ADDTEAMTOORG', config);
}

export async function removeTeamFromOrgFromAPI(idTeam, orgSecret) {
    let data = { idTeam: idTeam };
    const config = {
        headers: {
            'org-secret': orgSecret
        }
    };
    return patchRequest('/orgs/removeteam', data, 'REMOVETEAMFROMORG', config);
}

export async function getOrgByIdFromAPI(id, orgSecret) {
    const config = {
        headers: {
            'org-secret': orgSecret
        }
    };
    return getRequest(`/orgs/getbyid/${id}`, 'GETORG', config);
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

export async function addTeamToOrgService(idTeam, orgSecret) {
    let response;
    try {
        response = await addTeamToOrgFromAPI(idTeam, orgSecret);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible d\'ajouter une équipe à l\'organisation' };
    }
    return response;
}

export async function removeTeamFromOrgService(idTeam, orgSecret) {
    let response;
    try {
        response = await removeTeamFromOrgFromAPI(idTeam, orgSecret);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de retirer une équipe de l\'organisation' };
    }
    return response;
}

export async function getOrgByIdService(id, orgSecret) {
    let response;
    try {
        response = await getOrgByIdFromAPI(id, orgSecret);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer l\'organisation' };
    }
    return response;
}