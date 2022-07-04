"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdOpsTeamDAO = void 0;
const FirestoreConnectionSingleton_1 = require("../cloud/FirestoreConnectionSingleton");
const AdOpsTeam_1 = require("../AdOpsTeam");
class AdOpsTeamDAO {
    constructor() {
        this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
        this._pathToCollection = ['adOpsTeams'];
        this._adOpsTeamCollection = this._objectStore.getCollection(this._pathToCollection);
    }
    addAdOpsTeam(adOpsTeam) {
        return this._objectStore
            .getDocumentById(this._adOpsTeamCollection, adOpsTeam.name)
            .then((adOpsTeamsDocuments) => {
            if (adOpsTeamsDocuments.get('name'))
                throw new Error('AdOpsTeam já existe!');
            return this._objectStore;
        })
            .then((objectStore) => {
            return objectStore.addDocumentIn(this._adOpsTeamCollection, adOpsTeam.toJson(), adOpsTeam.name).get();
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
    getAdOpsTeam(adOpsTeamId) {
        return this._objectStore
            .getDocumentById(this._adOpsTeamCollection, adOpsTeamId)
            .then((adOpsTeam) => {
            if (!adOpsTeam.get('name'))
                throw new Error('AdOpsTeam não encontrado!');
            return new AdOpsTeam_1.AdOpsTeam(adOpsTeam.get('name'), adOpsTeam.get('active'), adOpsTeam.get('advertiserId'));
        })
            .catch((err) => {
            throw err;
        });
    }
    getAllAdOpsTeamsFrom(advertiser, permission) {
        const equal = '==';
        const conditions = [
            {
                key: 'advertiserId',
                operator: equal,
                value: advertiser,
            },
        ];
        return this._objectStore
            .getDocumentFiltered(this._adOpsTeamCollection, conditions)
            .then((adOpsTeamsDocuments) => {
            const adOpsTeams = [];
            adOpsTeamsDocuments.docs.map((adOpsTeamDocument) => {
                adOpsTeams.push(new AdOpsTeam_1.AdOpsTeam(adOpsTeamDocument.get('name'), adOpsTeamDocument.get('active'), adOpsTeamDocument.get('advertiserId')));
            });
            return permission !== 'owner' && permission !== 'admin'
                ? adOpsTeams.filter((AdOpsTeam) => AdOpsTeam.name !== 'Campanhas Internas')
                : adOpsTeams;
        })
            .catch((err) => {
            throw err;
        });
    }
    deactivateAdOpsTeam(adOpsTeamId) {
        return this._objectStore
            .updateDocumentById(this._adOpsTeamCollection, adOpsTeamId, { active: false })
            .then(() => true)
            .catch((err) => {
            throw err;
        });
    }
    reactivateAdOpsTeam(adOpsTeamId) {
        return this._objectStore
            .updateDocumentById(this._adOpsTeamCollection, adOpsTeamId, { active: true })
            .then(() => true)
            .catch((err) => {
            throw err;
        });
    }
}
exports.AdOpsTeamDAO = AdOpsTeamDAO;
