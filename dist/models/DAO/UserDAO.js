'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
class UserDAO {
	constructor(email, password) {
		this._email = email;
		this._password = password;
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	getAllUsersFrom(company, agency, userRequestPermission) {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('company', '==', company)
			.get()
			.then((querySnapshot) => {
				return this._objectStore.getUsersFromFirestore(querySnapshot, userRequestPermission, agency, true);
			})
			.catch((err) => {
				throw err;
			});
	}
	getUser() {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('email', '==', this._email)
			.get()
			.then((querySnapshot) => {
				return this._objectStore.getSingleUserFromFirestore(querySnapshot, this._password);
			})
			.catch((err) => {
				throw err;
			});
	}
	addUser(user) {
		return this._objectStore
			.addDocumentIn(this._authCollection, user.toJsonSave(), '')
			.get()
			.then((data) => {
				return data.id;
			})
			.catch((err) => console.log(err));
	}
	changePassword(user) {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(user.id)
			.get()
			.then((doc) => {
				return doc.ref.set(user.toJsonSave());
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
	deactivateUser(userId, userRequestPermission) {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(userId)
			.get()
			.then((doc) => {
				return this._objectStore.toggleUsersFromFirestore(doc, userRequestPermission, false);
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
	reactivateUser(userId, userRequestPermission) {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(userId)
			.get()
			.then((doc) => {
				return this._objectStore.toggleUsersFromFirestore(doc, userRequestPermission, true);
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
exports.UserDAO = UserDAO;
