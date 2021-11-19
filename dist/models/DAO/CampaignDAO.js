"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignDAO = void 0;
const FirestoreConnectionSingleton_1 = require("../cloud/FirestoreConnectionSingleton");
class CampaignDAO {
    constructor(campaign, agency) {
        this._campaignName = campaign;
        this._agency = agency;
        this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
        this._pathToCollection = ['campaigns'];
        this._authCollection = this._objectStore.getCollection(this._pathToCollection);
    }
    getCampaign(campaignId) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('campaignId', '==', campaignId)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                let campaign;
                querySnapshot.forEach((documentSnapshot) => {
                    if (documentSnapshot.get('name')) {
                        campaign = documentSnapshot.get('name');
                    }
                    else {
                        throw new Error('Nenhuma campanha encontrada!');
                    }
                });
                return campaign;
            }
            else {
                throw new Error('Nenhuma campanha encontrada!');
            }
        })
            .catch((err) => {
            throw err;
        });
    }
    getAllCampaignsFrom(company, agency, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('company', '==', company)
            .where('agency', '==', agency)
            .get()
            .then((querySnapshot) => {
            if (!agency && (userRequestPermission === 'user' || userRequestPermission === 'agencyOwner')) {
                throw new Error('Nenhuma campanha foi selecionada!');
            }
            if (querySnapshot.size > 0) {
                const agencia = agency !== 'Campanhas Internas' ? agency : 'CompanyCampaigns';
                const campaigns = [];
                querySnapshot.forEach((documentSnapshot) => {
                    const documentAgency = documentSnapshot.get('agency');
                    if (agencia === documentAgency) {
                        const campaignInfos = {
                            campaignName: documentSnapshot.get('name'),
                            campaignId: documentSnapshot.get('campaignId'),
                            agency: documentSnapshot.get('agency'),
                            activate: documentSnapshot.get('activate'),
                        };
                        if (campaignInfos.campaignName &&
                            campaignInfos.campaignId &&
                            campaignInfos.agency &&
                            campaignInfos.activate !== null &&
                            campaignInfos.activate !== undefined &&
                            !campaigns.includes(campaignInfos)) {
                            campaigns.push(campaignInfos);
                        }
                        else {
                            throw new Error('Erro na recuperação dos atributos da campanha ' + documentSnapshot.get('name') + '!');
                        }
                    }
                    else {
                        throw new Error('Nenhuma campanha encontrada!');
                    }
                });
                return campaigns;
            }
        })
            .catch((err) => {
            throw err;
        });
    }
    addCampaign(campaign) {
        return this._objectStore
            .addDocumentIn(this._authCollection, campaign.toJson(), campaign.name + ' - ' + campaign.agency)
            .get()
            .then(() => {
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    }
    getCampaignId() {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('name', '==', this._campaignName)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                querySnapshot.forEach((documentSnapshot) => {
                    const id = documentSnapshot.get('campaignId');
                    if (this._agency === documentSnapshot.get('agency')) {
                        return id;
                    }
                    else {
                        throw new Error('Falha ao recuperar o ID da campanha!');
                    }
                });
            }
            else {
                throw new Error('ID não encontrado!');
            }
        })
            .catch((err) => {
            throw err;
        });
    }
    deactivateCampaign(campaignId, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('campaignId', '==', campaignId)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    const campaign = doc.data();
                    if (userRequestPermission !== 'user') {
                        campaign.activate = false;
                    }
                    else {
                        throw new Error('Permissões insuficientes para inavitar a campanha!');
                    }
                    return doc.ref.set(campaign);
                });
            }
            else {
                throw new Error('ID não encontrado!');
            }
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
    reactivateCampaign(campaignId, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('campaignId', '==', campaignId)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    const campaign = doc.data();
                    if (userRequestPermission !== 'user') {
                        campaign.activate = true;
                    }
                    else {
                        throw new Error('Permissões insuficientes para reativar a campanha!');
                    }
                    return doc.ref.set(campaign);
                });
            }
            else {
                throw new Error('ID não encontrado!');
            }
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
}
exports.CampaignDAO = CampaignDAO;
