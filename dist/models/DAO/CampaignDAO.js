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
    getAllCampaignsFrom(agency, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('agency', '==', agency)
            .get()
            .then((querySnapshot) => {
            if (!agency && (userRequestPermission === 'user' || userRequestPermission === 'agencyOwner')) {
                throw new Error('Nenhuma campanha foi selecionada!');
            }
            return this._objectStore.getCampaignsFromFirestore(querySnapshot, agency);
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
    deactivateCampaign(campaignId, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('campaignId', '==', campaignId)
            .get()
            .then((querySnapshot) => {
            return this._objectStore.toggleCampaignsFromFirestore(querySnapshot, userRequestPermission, false);
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
            return this._objectStore.toggleCampaignsFromFirestore(querySnapshot, userRequestPermission, true);
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
