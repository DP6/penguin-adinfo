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
exports.FirestoreConnectionSingleton = void 0;
const firestore_1 = require('@google-cloud/firestore');
const ObjectStore_1 = require('../DAO/ObjectStore');
const User_1 = require('../User');
const bcrypt = require('bcrypt');
class FirestoreConnectionSingleton extends ObjectStore_1.ObjectStore {
	constructor() {
		super();
		if (process.env.ENV === 'development') {
			this._db = new firestore_1.Firestore({
				projectId: process.env.GCP_PROJECT_ID,
				credentials: JSON.parse(process.env.GCP_KEY),
			});
		} else {
			this._db = new firestore_1.Firestore();
		}
	}
	static getInstance() {
		if (!FirestoreConnectionSingleton._instance) {
			FirestoreConnectionSingleton._instance = new FirestoreConnectionSingleton();
		}
		return FirestoreConnectionSingleton._instance;
	}
	getCollection(path) {
		let c;
		let d;
		path.forEach((step, index) => {
			if (index % 2 === 0) {
				if (index === 0) c = this._db.collection(step);
				else c = d.collection(step);
			} else {
				d = c.doc(step);
			}
		});
		return c;
	}
	getDocument(path) {
		let c;
		let d;
		path.forEach((step, index) => {
			if (index % 2 === 0) {
				if (index === 0) c = this._db.collection(step);
				else c = d.collection(step);
			} else {
				d = c.doc(step);
			}
		});
		return d;
	}
	getAllDocumentsFrom(collection) {
		return new Promise((resolve, reject) => {
			collection
				.get()
				.then((snapshot) => {
					const docs = [];
					snapshot.forEach((doc) => {
						docs.push(doc.data());
					});
					resolve(docs);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	addDocumentIn(collection, document, documentName) {
		let docRef;
		if (documentName) {
			docRef = collection.doc(documentName);
		} else {
			docRef = collection.doc();
		}
		docRef.set(document);
		return docRef;
	}
	getCampaignsFromFirestore(querySnapshot, agency) {
		if (querySnapshot.size > 0) {
			const agencia = agency !== 'Campanhas Internas' ? agency : 'CompanyCampaigns';
			const campaigns = [];
			querySnapshot.forEach((documentSnapshot) => {
				const documentAgency = documentSnapshot.get('agency');
				if (agencia === documentAgency) {
					const campaignInfos = {
						campaignName: documentSnapshot.get('name'),
						campaignId: documentSnapshot.get('campaignId'),
						agency: documentSnapshot.get('agency'),
						activate: documentSnapshot.get('activate'),
					};
					if (
						campaignInfos.campaignName &&
						campaignInfos.campaignId &&
						campaignInfos.agency &&
						campaignInfos.activate !== null &&
						campaignInfos.activate !== undefined &&
						!campaigns.includes(campaignInfos)
					) {
						campaigns.push(campaignInfos);
					} else {
						throw new Error('Erro na recuperação dos atributos da campanha ' + documentSnapshot.get('name') + '!');
					}
				} else {
					throw new Error('Nenhuma campanha encontrada!');
				}
			});
			return campaigns;
		}
	}
	toggleCampaignsFromFirestore(querySnapshot, userRequestPermission, activateStatus) {
		if (querySnapshot) {
			let finalCampaignObject;
			querySnapshot.forEach((doc) => {
				const campaign = doc.data();
				if (userRequestPermission !== 'user') {
					campaign.activate = activateStatus;
				} else {
					throw new Error('Permissões insuficientes para reativar a campanha!');
				}
				finalCampaignObject = doc.ref.set(campaign);
			});
			return finalCampaignObject;
		} else {
			throw new Error('ID não encontrado!');
		}
	}
	toggleUsersFromFirestore(doc, userRequestPermission, activateStatus) {
		return __awaiter(this, void 0, void 0, function* () {
			const user = doc.data();
			let operationSucceeeded;
			if (
				user.permission === 'user' ||
				((user.permission === 'admin' || user.permission === 'agencyOwner') && userRequestPermission === 'owner')
			) {
				user.activate = activateStatus;
			} else if (user.permission === 'agencyOwner' && userRequestPermission === 'admin') {
				user.activate = activateStatus;
			} else {
				throw new Error('Permissões insuficientes para inativar o usuário!');
			}
			try {
				yield doc.ref.set(user);
				operationSucceeeded = true;
			} catch (e) {
				operationSucceeeded = false;
			}
			return operationSucceeeded;
		});
	}
	getUsersFromFirestore(querySnapshot, userRequestPermission, agency, isFromCompany) {
		if (querySnapshot.size > 0) {
			let conditionToGetUser;
			const users = [];
			querySnapshot.forEach((documentSnapshot) => {
				const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
				if (searchId) {
					const userAgency = documentSnapshot.get('agency');
					const userPermission = documentSnapshot.get('permission');
					isFromCompany
						? (conditionToGetUser =
								userPermission !== 'owner' || (userRequestPermission === 'admin' && userPermission === 'user'))
						: (userPermission === 'agencyOwner' || userPermission === 'user') && userAgency === agency;
					if (conditionToGetUser) {
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
	}
	getSingleUserFromFirestore(querySnapshot, password) {
		if (querySnapshot.size > 0) {
			let user;
			querySnapshot.forEach((documentSnapshot) => {
				const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
				if (searchId) {
					const validatePassword = bcrypt.compareSync(password, documentSnapshot.get('password'));
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
	}
	getAllAgenciesFromFirestore(querySnapshot, agency, userRequestPermission) {
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
	}
}
exports.FirestoreConnectionSingleton = FirestoreConnectionSingleton;
