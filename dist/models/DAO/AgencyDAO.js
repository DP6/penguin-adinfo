"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyDAO = void 0;
const FirestoreConnectionSingleton_1 = require("../cloud/FirestoreConnectionSingleton");
class AgencyDAO {
    constructor() {
        this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
    }
    getAllAgenciesFrom(company, agency, userRequestPermission) {
        return this._objectStore
            .getCollection(['tokens'])
            .where('company', '==', company)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                if (userRequestPermission === 'agencyOwner' || userRequestPermission === 'user') {
                    return [agency];
                }
                const agencies = [];
                querySnapshot.forEach((documentSnapshot) => {
                    const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
                    if (searchId) {
                        const userAgency = documentSnapshot.get('agency');
                        if (userAgency && !agencies.includes(userAgency)) {
                            agencies.push(userAgency);
                        }
                    }
                    else {
                        throw new Error('Nenhuma agência encontrada!');
                    }
                });
                return agencies;
            }
        })
            .catch((err) => {
            throw err;
        });
    }
}
exports.AgencyDAO = AgencyDAO;
