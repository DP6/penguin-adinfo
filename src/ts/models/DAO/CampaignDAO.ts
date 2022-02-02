import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference } from '@google-cloud/firestore';
import { Campaign } from '../Campaign';

export class CampaignDAO {
	private _objectStore: ObjectStore;
	private _authCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['campaigns'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Busca uma campanha da base de dados
	 * @param campaignId ID da campanha a ser buscada
	 * @returns Retorna campanha procurada
	 */
	public getCampaign(campaignId: string): Promise<string | void> {
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

	/**
	 * Retorna todas as agências de uma companhia
	 * @param agency Agência das campanhas a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista Objetos contendo atributos de cada campanha
	 */
	public getAllCampaignsFrom(
		agency: string,
		userRequestPermission: string
	): Promise<{ campaignName: string; campaignId: string; agency: string; activate: boolean }[]> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((campaigns) => {
				if (!agency && (userRequestPermission === 'user' || userRequestPermission === 'agencyOwner')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				const agencia = agency !== 'Campanhas Internas' ? agency : 'CompanyCampaigns';

				const campaignsToReturn: { campaignName: string; campaignId: string; agency: string; activate: boolean }[] =
					campaigns
						.filter((campaign) => campaign.agency === agencia)
						.map((campaign) => {
							if (
								campaign.campaignId &&
								campaign.name &&
								campaign.activate !== undefined &&
								campaign.activate !== null
							) {
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

	/**
	 * Adiciona uam nova campanha na base de dados
	 * @param campaign Campanha a ser adicionada
	 * @returns Booleano indicando sucesso ou fracasso da criação do usuário
	 */
	public addCampaign(campaign: Campaign): Promise<boolean> {
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

	/**
	 * Desativa uma campanha
	 * @param campaignId ID da campanha a ser desativada
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public deactivateCampaign(campaignId: string, userRequestPermission: string): Promise<boolean | void> {
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

	/**
	 * Resativa um usuário
	 * @param campaignName ID da campanha a ser reativada
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public reactivateCampaign(campaignId: string, userRequestPermission: string): Promise<boolean | void> {
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
