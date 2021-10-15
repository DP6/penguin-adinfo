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
					throw new Error('Email ou senha incorreto(s)!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Retorna todas as agências de uma companhia
	 * @param company Empresa(company) das agências a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de agências
	 */
	public getAllAgenciesFrom(company: string, agency: string, userRequestPermission: string): Promise<string[] | void> {
		return this._objectStore
			.getCollection(['tokens'])
			.where('company', '==', company)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					if (userRequestPermission === 'agencyOwner' || userRequestPermission === 'user') {
						return [agency];
					}
					const agencies: string[] = [];
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
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Retorna todas as agências de uma companhia
	 * @param company Empresa das agências a serem buscados
	 * @param agency Agência das campanhas a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de agências
	 */
	public getAllCampaignsFrom(
		agency: string,
		permission: string
	): Promise<{ campaignName: string; campaignId: string }[]> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('agency', '==', agency)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (agency === 'CompanyCampaigns' && (permission === 'user' || permission === 'agencyOwner')) {
					throw new Error('Nenhuma campanha foi selecionada!');
				}
				if (querySnapshot.size > 0) {
					const campaigns: { campaignName: string; campaignId: string }[] = [];
					querySnapshot.forEach((documentSnapshot) => {
						const documentAgency = documentSnapshot.get('agency');
						if (agency === documentAgency) {
							const campaignInfos = {
								campaignName: documentSnapshot.get('name'),
								campaignId: documentSnapshot.get('campaignId'),
								agency: documentSnapshot.get('agency'),
								activate: documentSnapshot.get('activate'),
							};
							if (campaignInfos.campaignName && campaignInfos.campaignId && !campaigns.includes(campaignInfos)) {
								campaigns.push(campaignInfos);
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
