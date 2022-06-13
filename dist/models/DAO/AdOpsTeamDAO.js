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
exports.AdOpsTeamDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const AdOpsTeam_1 = require('../AdOpsTeam');
class AdOpsTeamDAO {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['adOpsTeam'];
		this._adOpsTeamCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	addAdOpsTeam(adOpsTeam) {
		return this._objectStore
			.getAllDocumentsFrom(this._adOpsTeamCollection)
			.then((adOpsTeamsDocuments) => {
				const existsAdOpsTeam =
					adOpsTeamsDocuments.filter((adOpsTeamDocument) => adOpsTeamDocument.name === adOpsTeam.name).length > 0
						? true
						: false;
				if (existsAdOpsTeam) throw new Error('AdOpsTeam já existe!');
				return this._objectStore;
			})
			.then((objectStore) => {
				return objectStore.addDocumentIn(this._adOpsTeamCollection, adOpsTeam.toJson(), adOpsTeam.name).get();
			})
			.then((data) =>
				__awaiter(this, void 0, void 0, function* () {
					yield this._adOpsTeamCollection.doc(data.id).update({ id: data.id });
					return true;
				})
			)
			.catch((err) => {
				throw err;
			});
	}
	getAdOpsTeam(adOpsTeamId) {
		return this._objectStore
			.getDocumentById(this._adOpsTeamCollection, adOpsTeamId)
			.then((adOpsTeam) => {
				if (!adOpsTeam.get('name')) throw new Error('AdOpsTeam não encontrado!');
				return new AdOpsTeam_1.AdOpsTeam(adOpsTeam.get('name'), adOpsTeam.get('active'), adOpsTeam.get('advertiserId'));
			})
			.catch((err) => {
				throw err;
			});
	}
	getAllAdOpsTeamsFrom(advertiser) {
		return this._objectStore
			.getAllDocumentsFrom(this._adOpsTeamCollection)
			.then((adOpsTeams) => {
				return adOpsTeams
					.filter((adOpsTeam) => adOpsTeam.advertiserId === advertiser)
					.map((adOpsTeam) => new AdOpsTeam_1.AdOpsTeam(adOpsTeam.name, adOpsTeam.active, adOpsTeam.advertiserId));
			})
			.catch((err) => {
				throw err;
			});
	}
	deactivateAdOpsTeam(adOpsTeamId) {
		return this._objectStore
			.updateDocumentById(this._adOpsTeamCollection, adOpsTeamId, { active: false })
			.then(() => true)
			.catch((err) => {
				throw err;
			});
	}
	reactivateAdOpsTeam(adOpsTeamId) {
		return this._objectStore
			.updateDocumentById(this._adOpsTeamCollection, adOpsTeamId, { active: true })
			.then(() => true)
			.catch((err) => {
				throw err;
			});
	}
}
exports.AdOpsTeamDAO = AdOpsTeamDAO;
