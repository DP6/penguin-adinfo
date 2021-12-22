"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyDAO = void 0;
const FirestoreConnectionSingleton_1 = require("../cloud/FirestoreConnectionSingleton");
class AgencyDAO {
    constructor() {
        this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
        this._pathToCollection = ['tokens'];
    }
    getAllAgenciesFrom(company, agency, userRequestPermission) {
        return this._objectStore
            .getCollection(['tokens'])
            .where('company', '==', company)
            .get()
            .then((querySnapshot) => {
            return this._objectStore.getAllAgenciesFromFirestore(querySnapshot, agency, userRequestPermission);
        })
            .catch((err) => {
            throw err;
        });
    }
    getAllUsersFromAgency(company, agency, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('company', '==', company)
            .get()
            .then((querySnapshot) => {
            return this._objectStore.getUsersFromFirestore(querySnapshot, userRequestPermission, agency, false);
        })
            .catch((err) => {
            throw err;
        });
    }
}
exports.AgencyDAO = AgencyDAO;
