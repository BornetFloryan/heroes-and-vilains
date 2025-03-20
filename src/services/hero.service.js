import { getRequest, postRequest, putRequest } from "@/services/axios.service";

export async function getAllHeroesFromAPI() {
    return getRequest('/heroes/getaliases', 'GETALLHEROES');
}

export async function createHeroFromAPI(data) {
    return postRequest('/heroes/create', data, 'CREATEHERO');
}

export async function updateHeroFromAPI(data, config) {
    return putRequest('/heroes/update', data, 'UPDATEHERO', config);
}

export async function getHeroByIdFromAPI(id, config) {
    return getRequest(`/heroes/getbyid/${id}`, 'GETHERO', config);
}

// Service functions
export async function getAllHeroesService() {
    let response;
    try {
        response = await getAllHeroesFromAPI();
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les héros' };
    }
    return response;
}

export async function createHeroService(publicName, realName, powers) {
    let response;
    try {
        let data = {
            publicName,
            realName,
        };

        if (powers) {
            data.powers = powers.map(power => {
                if (!power.name || !power.type || !power.level) {
                    throw new Error("Each power must contain name, type, and level fields.");
                }
                if (power.type < 1 || power.type > 7) {
                    throw new Error("Power type must be between 1 and 7.");
                }
                if (power.level < 0 || power.level > 100) {
                    throw new Error("Power level must be between 0 and 100.");
                }
                return power;
            });
        }

        response = await createHeroFromAPI(data);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de créer un héros' };
    }
    return response;
}

export async function updateHeroService(id, publicName, realName, powers, orgSecret) {
    let response;
    try {
        let data = {
            _id: id,
            publicName,
            realName,
            powers
        };

        const config = {
            headers: { 'org-secret': orgSecret }
        };

        response = await updateHeroFromAPI(data, config);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de mettre à jour le héros' };
    }
    return response;
}

export async function getHeroByIdService(id, orgSecret) {
    let response;
    try {
        const config = {
            headers: { 'org-secret': orgSecret }
        };

        response = await getHeroByIdFromAPI(id, config);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le héros' };
    }
    return response;
}