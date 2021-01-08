'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthDAO = void 0;
const FirestoreConnection_1 = require('../cloud/FirestoreConnection');
const Auth_1 = require('../Auth');
class AuthDAO {
	constructor(company, key) {
		this._key = key;
		this._company = company;
		this._objectStore = new FirestoreConnection_1.FirestoreConnection();
	}
	getAuth() {
		const pathToAuth = ['companies', this._company, 'tokens', this._key];
		return this._objectStore
			.getDocument(pathToAuth)
			.get()
			.then((data) => {
				const jsonAuth = data.data();
				return new Auth_1.Auth(jsonAuth.permission, jsonAuth.agency);
			})
			.catch((err) => console.log(err));
	}
}
exports.AuthDAO = AuthDAO;
