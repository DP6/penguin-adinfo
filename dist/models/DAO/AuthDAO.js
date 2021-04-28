'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const Auth_1 = require('../Auth');
class AuthDAO {
	constructor(token) {
		this._token = token;
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	getAuth() {
		const pathToAuth = this._pathToCollection.concat(this._token);
		return this._objectStore
			.getDocument(pathToAuth)
			.get()
			.then((data) => {
				const jsonAuth = data.data();
				return new Auth_1.Auth(jsonAuth.permission, jsonAuth.company, jsonAuth.agency);
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
