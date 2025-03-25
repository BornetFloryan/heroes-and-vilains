import { getRequest, postRequest, putRequest } from "@/services/axios.service";

export async function getAllHeroesFromAPI() {
    return getRequest('herocorp/heroes/getaliases', 'GETALLHEROES');
}

export async function createHeroFromAPI(data) {
    return postRequest('herocorp/heroes/create', data, 'CREATEHERO');
}

export async function updateHeroFromAPI(data) {
    return putRequest('herocorp/heroes/update', data, 'UPDATEHERO');
}

export async function getHeroByIdFromAPI(id) {
    return getRequest(`herocorp/heroes/getbyid/${id}`, 'GETHERO');
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

export async function updateHeroService(id, publicName, realName, powers) {
    let response;
    try {
        let data = {
            _id: id,
            publicName,
            realName,
            powers
        };

        response = await updateHeroFromAPI(data);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de mettre à jour le héros' };
    }
    return response;
}

export async function getHeroByIdService(id) {
    let response;
    try {

        response = await getHeroByIdFromAPI(id);
    } catch (error) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le héros' };
    }
    return response;
}