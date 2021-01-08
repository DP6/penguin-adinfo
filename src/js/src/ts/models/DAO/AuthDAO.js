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
		this._pathToCollection = ['companies', company, 'tokens'];
		this._authCollection = this._objectStore.getCollection(
			this._pathToCollection
		);
	}
	getAuth() {
		const pathToAuth = this._pathToCollection.concat(this._key);
		return this._objectStore
			.getDocument(pathToAuth)
			.get()
			.then((data) => {
				const jsonAuth = data.data();
				return new Auth_1.Auth(jsonAuth.permission, jsonAuth.agency);
			})
			.catch((err) => console.log(err));
	}
	addAuth(jsonAuth) {
		return this._objectStore
			.addDocumentIn(this._authCollection, jsonAuth, '')
			.get()
			.then((data) => {
				return data.id;
			})
			.catch((err) => console.log(err));
	}
}
exports.AuthDAO = AuthDAO;
