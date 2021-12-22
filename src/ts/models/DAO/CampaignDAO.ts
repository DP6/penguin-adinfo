import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore';
import { Campaign } from '../Campaign';

export class CampaignDAO {
	private _campaignName: string;
	private _agency: string;
	private _objectStore: ObjectStore;
	private _authCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor(campaign?: string, agency?: string) {
		this._campaignName = campaign;
		this._agency = agency;
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['campaigns'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}
	/**
	 * Consulta a campanha na base de dados
	 * @returns Retorna campanha procurada
	 */
	public getCampaign(campaignId: string): Promise<string | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('campaignId', '==', campaignId)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					let campaign: string;
					querySnapshot.forEach((documentSnapshot) => {
						if (documentSnapshot.get('name')) {
							campaign = documentSnapshot.get('name');
						} else {
							throw new Error('Nenhuma campanha encontrada!');
						}
					});
					return campaign;
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
			.getCollection(this._pathToCollection)
			.where('agency', '==', agency)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (!agency && (userRequestPermission === 'user' || userRequestPermission === 'agencyOwner')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				return this._objectStore.getCampaignsFromFirestore(querySnapshot, agency);
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
			.getCollection(this._pathToCollection)
			.where('campaignId', '==', campaignId)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				return this._objectStore.toggleCampaignsFromFirestore(querySnapshot, userRequestPermission, false);
			})
			.then(() => {
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
			.getCollection(this._pathToCollection)
			.where('campaignId', '==', campaignId)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				return this._objectStore.toggleCampaignsFromFirestore(querySnapshot, userRequestPermission, true);
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
