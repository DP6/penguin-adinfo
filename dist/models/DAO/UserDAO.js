'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
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
		this._pathToCollection = ['users'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	getAllUsersFrom(advertiser, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const users = [];
				const allAdvertiserUsers = allUsersDocuments.filter((user) => user.advertiser === advertiser);
				if (allAdvertiserUsers.length > 0) {
					allAdvertiserUsers.forEach((advertiserUser) => {
						if (
							advertiserUser.permission !== 'owner' ||
							(userRequestPermission === 'admin' && advertiserUser.permission === 'user')
						) {
							const user = new User_1.User(
								advertiserUser.userid,
								advertiserUser.advertiser,
								advertiserUser.email,
								advertiserUser.active,
								advertiserUser.adOpsTeam
							);
							users.push(user);
						}
					});
				} else {
					throw new Error('Nenhum usuário encontrado!');
				}
				return users;
			})
			.catch((err) => {
				throw err;
			});
	}
	getUser() {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				if (allUsersDocuments.length > 0) {
					const [userToValidate] = allUsersDocuments.filter((user) => user.email === this._email);
					const validatePassword = bcrypt.compareSync(this._password, userToValidate.password);
					if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
					const user = new User_1.User(
						userToValidate.userid,
						userToValidate.permission,
						userToValidate.advertiser,
						userToValidate.email,
						userToValidate.active,
						userToValidate.adOpsTeam
					);
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
			.then((data) =>
				__awaiter(this, void 0, void 0, function* () {
					yield this._authCollection.doc(data.id).update({ userid: data.id });
					return data.id;
				})
			)
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
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const [userToDeactivate] = allUsersDocuments.filter((user) => user.userid === userId);
				if (
					userToDeactivate.permission === 'user' ||
					((userToDeactivate.permission === 'admin' || userToDeactivate.permission === 'adOpsManager') &&
						userRequestPermission === 'owner')
				) {
					userToDeactivate.active = false;
				} else if (userToDeactivate.permission === 'adOpsManager' && userRequestPermission === 'admin') {
					userToDeactivate.active = false;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return userToDeactivate;
			})
			.then((userToDeactivate) => {
				this._objectStore.getCollection(this._pathToCollection).doc(userToDeactivate.userid).update(userToDeactivate);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
	reactivateUser(userId, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const [userToReactivate] = allUsersDocuments.filter((user) => user.userid === userId);
				if (
					userToReactivate.permission === 'user' ||
					((userToReactivate.permission === 'admin' || userToReactivate.permission === 'adOpsManager') &&
						userRequestPermission === 'owner')
				) {
					userToReactivate.active = true;
				} else if (userToReactivate.permission === 'adOpsManager' && userRequestPermission === 'admin') {
					userToReactivate.active = true;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return userToReactivate;
			})
			.then((userToReactivate) => {
				this._objectStore.getCollection(this._pathToCollection).doc(userToReactivate.userid).update(userToReactivate);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
	reactivateCampaign(campaignId, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((campaigns) => {
				if (userRequestPermission !== 'user') {
					const [filteredCampaign] = campaigns.filter((campaign) => campaign.campaignId === campaignId);
					filteredCampaign.active = true;
					return filteredCampaign;
				} else {
					throw new Error('Permissões insuficientes para inavitar a campanha!');
				}
			})
			.then((filteredCampaign) => {
				this._objectStore
					.getCollection(this._pathToCollection)
					.doc(`${filteredCampaign.name} - ${filteredCampaign.adOpsTeam}`)
					.update(filteredCampaign);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
exports.UserDAO = UserDAO;
