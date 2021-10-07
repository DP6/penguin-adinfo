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
    addCampaign(campaign) {
        return this._objectStore
            .addDocumentIn(this._authCollection, campaign.toJson(), campaign.name)
            .get()
            .then(() => {
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    }
    deactivateCampaign(campaignName, agency, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .doc(campaignName)
            .get()
            .then((doc) => {
            const campaign = doc.data();
            if (campaign.agency === agency &&
                (userRequestPermission === 'admin' ||
                    userRequestPermission === 'owner' ||
                    userRequestPermission === 'agencyOwner')) {
                campaign.activate = false;
            }
            else {
                throw new Error('Permissões insuficientes para inavitar a campanha!');
            }
            return doc.ref.set(campaign);
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
    reactivateCampaign(campaignName, agency, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .doc(campaignName)
            .get()
            .then((doc) => {
            const campaign = doc.data();
            if (campaign.agency === agency &&
                (userRequestPermission === 'admin' ||
                    userRequestPermission === 'owner' ||
                    userRequestPermission === 'agencyOwner')) {
                campaign.activate = true;
            }
            else {
                throw new Error('Permissões insuficientes para reativar a campanha!');
            }
            return doc.ref.set(campaign);
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
