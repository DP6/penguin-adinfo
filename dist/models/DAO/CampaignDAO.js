'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CampaignDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
class CampaignDAO {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['campaigns'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	getCampaign(campaignId) {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((campaigns) => {
				if (campaigns.length > 0) {
					const [filteredCampaign] = campaigns.filter((campaign) => campaign.campaignId === campaignId);
					return filteredCampaign.name;
				} else {
					throw new Error('Nenhuma campanha encontrada!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}
	getAllCampaignsFrom(agency, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((campaigns) => {
				if (!agency && (userRequestPermission === 'user' || userRequestPermission === 'agencyOwner')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				const agencia = agency !== 'Campanhas Internas' ? agency : 'CompanyCampaigns';
				const campaignsToReturn = campaigns
					.filter((campaign) => campaign.agency === agencia)
					.map((campaign) => {
						if (campaign.campaignId && campaign.name && campaign.activate !== undefined && campaign.activate !== null) {
							return {
								campaignName: campaign.name,
								campaignId: campaign.campaignId,
								agency: campaign.agency,
								activate: campaign.activate,
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
			.addDocumentIn(this._authCollection, campaign.toJson(), campaign.name + ' - ' + campaign.agency)
			.get()
			.then(() => {
				return true;
			})
			.catch((err) => {
				console.log(err);
				return false;
			});
	}
	deactivateCampaign(campaignId, userRequestPermission) {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((campaigns) => {
				if (userRequestPermission !== 'user') {
					const [filteredCampaign] = campaigns.filter((campaign) => campaign.campaignId === campaignId);
					filteredCampaign.activate = false;
					return filteredCampaign;
				} else {
					throw new Error('Permissões insuficientes para inavitar a campanha!');
				}
			})
			.then((filteredCampaign) => {
				this._objectStore
					.getCollection(this._pathToCollection)
					.doc(`${filteredCampaign.name} - ${filteredCampaign.agency}`)
					.update(filteredCampaign);
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
					filteredCampaign.activate = true;
					return filteredCampaign;
				} else {
					throw new Error('Permissões insuficientes para inavitar a campanha!');
				}
			})
			.then((filteredCampaign) => {
				this._objectStore
					.getCollection(this._pathToCollection)
					.doc(`${filteredCampaign.name} - ${filteredCampaign.agency}`)
					.update(filteredCampaign);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
exports.CampaignDAO = CampaignDAO;
