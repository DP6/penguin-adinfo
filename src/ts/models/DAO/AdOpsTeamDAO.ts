import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { ObjectStore } from './ObjectStore';
import { CollectionReference, WhereFilterOp } from '@google-cloud/firestore';
import { AdOpsTeam } from '../AdOpsTeam';

export class AdOpsTeamDAO {
	private _objectStore: ObjectStore;
	private _pathToCollection: string[];
	private _adOpsTeamCollection: CollectionReference;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['adOpsTeams'];
		this._adOpsTeamCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Adiciona um novo adOpsTeam na base de dados
	 * @param adOpsTeam AdOpsTeam a ser adicionado
	 * @returns ID do novo adOpsTeam
	 */
	public addAdOpsTeam(adOpsTeam: AdOpsTeam): Promise<boolean | void> {
		return this._objectStore
			.getDocumentById(this._adOpsTeamCollection, adOpsTeam.name)
			.then((adOpsTeamsDocuments) => {
				if (adOpsTeamsDocuments.get('name')) throw new Error('AdOpsTeam já existe!');
				return this._objectStore;
			})
			.then((objectStore) => {
				return objectStore.addDocumentIn(this._adOpsTeamCollection, adOpsTeam.toJson(), adOpsTeam.name).get();
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Busca um time adOps da base de dados
	 * @param adOpsTeamId ID do time adOps a ser buscada
	 * @returns Retorna o adOps procurado
	 */
	public getAdOpsTeam(adOpsTeamId: string): Promise<AdOpsTeam> {
		return this._objectStore
			.getDocumentById(this._adOpsTeamCollection, adOpsTeamId)
			.then((adOpsTeam) => {
				if (!adOpsTeam.get('name')) throw new Error('AdOpsTeam não encontrado!');
				return new AdOpsTeam(adOpsTeam.get('name'), adOpsTeam.get('active'), adOpsTeam.get('advertiserId'));
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Retorna todas as adOpsTeams de um advertiser
	 * @param advertiser advertiser onde serão buscados os times de adOps
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista Objetos contendo atributos de cada campanha
	 */
	public getAllAdOpsTeamsFrom(advertiser: string): Promise<AdOpsTeam[]> {
		const equal: WhereFilterOp = '==';
		const conditions = [
			{
				key: 'advertiserId',
				operator: equal,
				value: advertiser,
			},
		];
		return this._objectStore
			.getDocumentFiltered(this._adOpsTeamCollection, conditions)
			.then((adOpsTeamsDocuments) => {
				const adOpsTeams: AdOpsTeam[] = [];
				adOpsTeamsDocuments.docs.map((adOpsTeamDocument) => {
					adOpsTeams.push(
						new AdOpsTeam(
							adOpsTeamDocument.get('name'),
							adOpsTeamDocument.get('active'),
							adOpsTeamDocument.get('advertiserId')
						)
					);
				});
				return adOpsTeams;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Desativa um time de adOps
	 * @param adOpsTeamId ID do adOpsTeam a a ser desativado
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public deactivateAdOpsTeam(adOpsTeamId: string): Promise<boolean> {
		return this._objectStore
			.updateDocumentById(this._adOpsTeamCollection, adOpsTeamId, { active: false })
			.then(() => true)
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Reativa um adOpsTeam
	 * @param adOpsTeamId ID do time adOps a ser reativado
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public reactivateAdOpsTeam(adOpsTeamId: string): Promise<boolean> {
		return this._objectStore
			.updateDocumentById(this._adOpsTeamCollection, adOpsTeamId, { active: true })
			.then(() => true)
			.catch((err) => {
				throw err;
			});
	}
}
