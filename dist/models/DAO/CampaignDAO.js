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
exports.CampaignDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const Campaign_1 = require('../Campaign');
class CampaignDAO {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['campaigns'];
		this._campaignCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	getCampaign(campaignId) {
		const equal = '==';
		const conditions = [
			{
				key: 'campaignId',
				operator: equal,
				value: campaignId,
			},
		];
		return this._objectStore.getDocumentFiltered(this._campaignCollection, conditions).then((campaigns) => {
			if (campaigns.docs.length > 0) {
				return campaigns.docs[0].id;
			}
		});
	}
	getAllCampaigns(advertiser) {
		const equal = '==';
		const conditions = [
			{
				key: 'advertiser',
				operator: equal,
				value: advertiser,
			},
		];
		return this._objectStore
			.getDocumentFiltered(this._campaignCollection, conditions)
			.then((campaignsDocuments) => {
				const campanha = [];
				campaignsDocuments.docs.map((campaignsDocument) => {
					campanha.push(
						new Campaign_1.Campaign(
							campaignsDocument.get('name'),
							campaignsDocument.get('advertiser'),
							campaignsDocument.get('adOpsTeam'),
							campaignsDocument.get('campaignId'),
							campaignsDocument.get('active'),
							campaignsDocument.get('created')
						)
					);
				});
				return campanha;
			})
			.catch((err) => {
				throw err;
			});
	}
	getAllCampaignsFrom(adOpsTeam, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._campaignCollection)
			.then((campaigns) => {
				if (!adOpsTeam && (userRequestPermission === 'user' || userRequestPermission === 'adOpsManager')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				const agencia = adOpsTeam !== 'Campanhas Internas' ? adOpsTeam : 'AdvertiserCampaigns';
				const campaignsToReturn = campaigns
					.filter((campaign) => campaign.adOpsTeam === agencia)
					.map((campaign) => {
						if (campaign.campaignId && campaign.name && campaign.active !== undefined && campaign.active !== null) {
							return {
								campaignName: campaign.name,
								campaignId: campaign.campaignId,
								adOpsTeam: campaign.adOpsTeam,
								active: campaign.active,
							};
						} else {
							throw new Error('Erro na recuperação dos atributos da campanha ' + campaign.name + '!');
						}
					});
				return campaignsToReturn;
			})
			.catch((err) => {
				throw err;
			});
	}
	addCampaign(campaign) {
		return this._objectStore
			.addDocumentIn(this._campaignCollection, campaign.toJson(), '')
			.get()
			.then((data) =>
				__awaiter(this, void 0, void 0, function* () {
					yield this._campaignCollection.doc(data.id).update({ campaignId: data.id });
					return true;
				})
			)
			.catch((err) => {
				return false;
			});
	}
	deactivateCampaign(campaignId, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._campaignCollection)
			.then((campaigns) => {
				if (userRequestPermission !== 'user') {
					const [filteredCampaign] = campaigns.filter((campaign) => campaign.campaignId === campaignId);
					filteredCampaign.active = false;
					return filteredCampaign;
				} else {
					throw new Error('Permissões insuficientes para inavitar a campanha!');
				}
			})
			.then((filteredCampaign) => {
				this._objectStore.getCollection(this._pathToCollection).doc(campaignId).update(filteredCampaign);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
	reactivateCampaign(campaignId, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._campaignCollection)
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
				this._objectStore.getCollection(this._pathToCollection).doc(campaignId).update(filteredCampaign);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
	getAllCampaignsFromAdOpsTeam(advertiserId, adOpsTeamId) {
		const equal = '==';
		const conditions = [
			{
				key: 'advertiser',
				operator: equal,
				value: advertiserId,
			},
			{
				key: 'adOpsTeam',
				operator: equal,
				value: adOpsTeamId,
			},
		];
		return this._objectStore
			.getDocumentFiltered(this._campaignCollection, conditions)
			.then((campaignsDocuments) => {
				const campaigns = [];
				campaignsDocuments.docs.map((campaignDocument) => {
					campaigns.push(
						new Campaign_1.Campaign(
							campaignDocument.get('name'),
							campaignDocument.get('advertiser'),
							campaignDocument.get('adOpsTeam'),
							campaignDocument.get('campaignId'),
							campaignDocument.get('active'),
							campaignDocument.get('created')
						)
					);
				});
				return campaigns;
			})
			.catch((err) => {
				throw err;
			});
	}
	campaignExists(campaignName) {
		const equal = '==';
		const conditions = [
			{
				key: 'name',
				operator: equal,
				value: campaignName,
			},
		];
		return this._objectStore.documentExists(this._campaignCollection, conditions);
	}
}
exports.CampaignDAO = CampaignDAO;
