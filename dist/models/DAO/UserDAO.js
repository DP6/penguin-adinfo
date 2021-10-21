'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const User_1 = require('../User');
const bcrypt = require('bcrypt');
class UserDAO {
	constructor(email, password) {
		this._email = email;
		this._password = password;
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	getUserId() {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('email', '==', this._email)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.size > 0) {
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
						if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
						if (searchId) {
							return searchId[0];
						} else {
							throw new Error('Falha ao recuperar o ID do usuário');
						}
					});
				} else {
					throw new Error('ID não encontrado!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}
	getAllUsersFrom(company, userRequestPermission) {
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
							if (userPermission !== 'owner' || (userRequestPermission === 'admin' && userPermission === 'user')) {
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
	getUser() {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('email', '==', this._email)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.size > 0) {
					let user;
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
							if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
							user = new User_1.User(
								searchId[0],
								documentSnapshot.get('permission'),
								documentSnapshot.get('company'),
								documentSnapshot.get('email'),
								documentSnapshot.get('activate'),
								documentSnapshot.get('agency')
							);
						} else {
							throw new Error('Nenhum usuário encontrado!');
						}
					});
					return user;
				} else {
					throw new Error('Email ou senha incorreto(s)!');
				}
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
				const user = doc.data();
				if (
					user.permission === 'user' ||
					((user.permission === 'admin' || user.permission === 'agencyOwner') && userRequestPermission === 'owner')
				) {
					user.activate = false;
				} else if (user.permission === 'agencyOwner' && userRequestPermission === 'admin') {
					user.activate = false;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return doc.ref.set(user);
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
				const user = doc.data();
				if (
					user.permission === 'user' ||
					((user.permission === 'admin' || user.permission === 'agencyOwner') && userRequestPermission === 'owner')
				) {
					user.activate = true;
				} else if (user.permission === 'agencyOwner' && userRequestPermission === 'admin') {
					user.activate = true;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return doc.ref.set(user);
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
