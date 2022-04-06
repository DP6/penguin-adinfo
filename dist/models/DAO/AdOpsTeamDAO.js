"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdOpsTeamDAO = void 0;
const FirestoreConnectionSingleton_1 = require("../cloud/FirestoreConnectionSingleton");
const User_1 = require("../User");
class AdOpsTeamDAO {
    constructor() {
        this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
        this._pathToCollection = ['tokens'];
        this._authCollection = this._objectStore.getCollection(this._pathToCollection);
    }
    getAllAdOpsTeamsFrom(advertiser, adOpsTeam, userRequestPermission) {
        return this._objectStore
            .getAllDocumentsFrom(this._authCollection)
            .then((users) => {
            if (userRequestPermission === 'adOpsTeamManager' || userRequestPermission === 'user') {
                return [adOpsTeam];
            }
            const adOpsTeamsToReturn = users
                .filter((user) => user.advertiser === advertiser)
                .map((filteredUsers) => {
                if (filteredUsers.adOpsTeam !== undefined && filteredUsers.adOpsTeam !== null) {
                    return filteredUsers.adOpsTeam;
                }
                else {
                    throw new Error('Nenhuma adOpsTeam encontrada!');
                }
            });
            return [...new Set(adOpsTeamsToReturn.filter((adOpsTeam) => adOpsTeam))];
        })
            .catch((err) => {
            throw err;
        });
    }
    getAllUsersFromAdOpsTeam(advertiser, adOpsTeam, requestUserid) {
        return this._objectStore
            .getAllDocumentsFrom(this._authCollection)
            .then((allUsersDocuments) => {
            const filteredUsers = allUsersDocuments.filter((user) => user.advertiser === advertiser && user.adOpsTeam === adOpsTeam && user.userid !== requestUserid);
            const users = [];
            if (filteredUsers.length > 0) {
                filteredUsers.forEach((user) => {
                    const userToPush = new User_1.User(user.userid, user.permission, user.advertiser, user.email, user.active, user.adOpsTeam);
                    users.push(userToPush);
                });
                return users;
            }
            else {
                throw new Error('Nenhum usuário encontrado!');
            }
        })
            .catch((err) => {
            throw err;
        });
    }
}
exports.AdOpsTeamDAO = AdOpsTeamDAO;
