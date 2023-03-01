import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, WhereFilterOp } from '@google-cloud/firestore';
import { Campaign } from '../Campaign';
import { JsonUtils } from '../../utils/JsonUtils';
import adOpsTeam from '../../routes/adOpsTeam';

export class CampaignDAO {
	private _objectStore: ObjectStore;
	private _campaignCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['campaigns'];
		this._campaignCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Busca uma campanha da base de dados
	 * @param campaignId ID da campanha a ser buscada
	 * @returns Retorna campanha procurada
	 */
	public getCampaign(campaignId: string): Promise<string | void> {
		const equal: WhereFilterOp = '==';
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

	/**
	 * retorna todas as campanhas de todos os adopsteam de um advertiser.
	 * @param advertiser do usuario onde vão ser pegado as campanhas.
	 * @returns Lista Objetos contendo atributos de cada campanha
	 */
	public getAllCampaigns(advertiser: string): Promise<Campaign[] | void> {
		const equal: WhereFilterOp = '==';
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
				const campanha: Campaign[] = [];
				campaignsDocuments.docs.map((campaignsDocument) => {
					campanha.push(
						new Campaign(
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

	/**
	 * Retorna todas as adOpsTeams de um advertiser
	 * @param adOpsTeam adOpsTeam das campanhas a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista Objetos contendo atributos de cada campanha
	 */
	public getAllCampaignsFrom(
		adOpsTeam: string,
		userRequestPermission: string
	): Promise<{ campaignName: string; campaignId: string; adOpsTeam: string; active: boolean }[]> {
		return this._objectStore
			.getAllDocumentsFrom(this._campaignCollection)
			.then((campaigns) => {
				if (!adOpsTeam && (userRequestPermission === 'user' || userRequestPermission === 'adOpsManager')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				const agencia = adOpsTeam !== 'Campanhas Internas' ? adOpsTeam : 'AdvertiserCampaigns';

				const campaignsToReturn: { campaignName: string; campaignId: string; adOpsTeam: string; active: boolean }[] =
					campaigns
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
								throw new Error('Erro na recuperação dos atributos da campanha ' + campaign.name + '!'); // arrumar - ta feio
							}
						});

				return campaignsToReturn;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Adiciona uma nova campanha na base de dados
	 * @param campaign Campanha a ser adicionada
	 * @returns Booleano indicando sucesso ou fracasso da criação da campanha
	 */
	public addCampaign(campaign: Campaign): Promise<boolean> {
		return this._objectStore
			.addDocumentIn(this._campaignCollection, campaign.toJson(), '')
			.get()
			.then(async (data) => {
				await this._campaignCollection.doc(data.id).update({ campaignId: data.id });
				return true;
			})
			.catch((err) => {
				return false;
			});
	}

	/**Retorna o adopsteam de uma campanha
	 * @param CampaignId ID da campanha a ser buscada
	 * @retuns retorna a adopsteam da campanha
	 */
	public getAdopsteamCampaign(campaignId: string): Promise<Campaign[] | string> {
		const equal: WhereFilterOp = '==';
		const conditions = [
			{
				key: 'campaignId',
				operator: equal,
				value: campaignId,
			},
		];
		return this._objectStore
			.getDocumentFiltered(this._campaignCollection, conditions)
			.then((campaignsDocuments) => {
				const campanha: Campaign[] = [];
				campaignsDocuments.docs.map((campaignsDocument) => {
					campanha.push(
						new Campaign(
							campaignsDocument.get('name'),
							campaignsDocument.get('advertiser'),
							campaignsDocument.get('adOpsTeam'),
							campaignsDocument.get('campaignId'),
							campaignsDocument.get('active'),
							campaignsDocument.get('created')
						)
					);
				});
				return campanha[0].adOpsTeam;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Desativa uma campanha
	 * @param campaignId ID da campanha a ser desativada
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public deactivateCampaign(campaignId: string): Promise<boolean> {
		return this._objectStore
			.updateDocumentById(this._campaignCollection, campaignId, { active: false })
			.then(() => true)
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Reativa uma campanha
	 * @param campaignName ID da campanha a ser reativada
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public reactivateCampaign(campaignId: string): Promise<boolean> {
		return this._objectStore
			.updateDocumentById(this._campaignCollection, campaignId, { active: true })
			.then(() => true)
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Pega todas as campanhas para um adOpsTeam especificado
	 * @param advertiserId Advertiser das campanhas a serem selecionadas
	 * @param adOpsTeamId AdOpsTeams das campanhas a serem selecionadas
	 * @returns Lista de campanhas de acordo com os filtros especificados
	 */
	public getAllCampaignsFromAdOpsTeam(advertiserId: string, adOpsTeamId: string): Promise<Campaign[]> {
		const equal: WhereFilterOp = '==';
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
				const campaigns: Campaign[] = [];
				campaignsDocuments.docs.map((campaignDocument) => {
					campaigns.push(
						new Campaign(
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

	/**
	 * checa pelo nome se a nova campanha ja existe.
	 * @param campaignName nome da nova campanha.
	 * @returns verifica se a o nome dessa nova campanha já existe na base de dados, se sim retorna true, senão false.
	 */
	public campaignExists(campaignName?: string): Promise<boolean> {
		const equal: WhereFilterOp = '==';
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
