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
		company: string,
		agency: string,
		userRequestPermission: string
	): Promise<{ campaignName: string; campaignId: string; agency: string; activate: boolean }[]> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('company', '==', company)
			.where('agency', '==', agency)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (!agency && (userRequestPermission === 'user' || userRequestPermission === 'agencyOwner')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				if (querySnapshot.size > 0) {
					const agencia = agency;
					const campaigns: { campaignName: string; campaignId: string; agency: string; activate: boolean }[] = [];
					querySnapshot.forEach((documentSnapshot) => {
						const documentAgency = documentSnapshot.get('agency');
						if (agencia === documentAgency) {
							const campaignInfos: { campaignName: string; campaignId: string; agency: string; activate: boolean } = {
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
	 * Busca o ID do campanha na base de dados
	 * @returns ID do campanha
	 */
	// Funcao ainda nao sendo utilizada, ao pensar em utilizar, revalidar logica dela (principalemnte o where)
	public getCampaignId(): Promise<string | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('name', '==', this._campaignName)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					querySnapshot.forEach((documentSnapshot) => {
						const id = documentSnapshot.get('campaignId');
						if (this._agency === documentSnapshot.get('agency')) {
							return id;
						} else {
							throw new Error('Falha ao recuperar o ID da campanha!');
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
				if (querySnapshot) {
					querySnapshot.forEach((doc) => {
						const campaign = doc.data();
						if (userRequestPermission !== 'user') {
							campaign.activate = false;
						} else {
							throw new Error('Permissões insuficientes para inavitar a campanha!');
						}
						return doc.ref.set(campaign);
					});
				} else {
					throw new Error('ID não encontrado!');
				}
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
				if (querySnapshot) {
					querySnapshot.forEach((doc) => {
						const campaign = doc.data();
						if (userRequestPermission !== 'user') {
							campaign.activate = true;
						} else {
							throw new Error('Permissões insuficientes para reativar a campanha!');
						}
						return doc.ref.set(campaign);
					});
				} else {
					throw new Error('ID não encontrado!');
				}
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
