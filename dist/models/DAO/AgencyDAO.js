'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AgencyDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const User_1 = require('../User');
class AgencyDAO {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
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
						} else {
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
	getAllUsersFromAgency(company, agency, userRequestPermission) {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('company', '==', company)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.size > 0) {
					const users = [];
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							const userPermission = documentSnapshot.get('permission');
							const userAgency = documentSnapshot.get('agency');
							if ((userPermission === 'agencyOwner' || userPermission === 'user') && userAgency === agency) {
								const user = new User_1.User(
									searchId[0],
									userPermission,
									documentSnapshot.get('company'),
									documentSnapshot.get('email'),
									documentSnapshot.get('activate'),
									documentSnapshot.get('agency')
								);
								users.push(user);
							}
						} else {
							throw new Error('Nenhum usuário encontrado!');
						}
					});
					return users;
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}
exports.AgencyDAO = AgencyDAO;
