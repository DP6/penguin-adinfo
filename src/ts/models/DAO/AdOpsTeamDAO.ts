import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { QuerySnapshot } from '@google-cloud/firestore';
import { ObjectStore } from './ObjectStore';
import { User } from '../User';
import { CollectionReference } from '@google-cloud/firestore';

export class AdOpsTeamDAO {
	private _objectStore: ObjectStore;
	private _pathToCollection: string[];
	private _authCollection: CollectionReference;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Retorna todas os adOpsTeams de um advertiser
	 * @param advertiser Empresa(advertiser) das adOpsTeams a serem buscados
	 * @param adOpsTeam Empresa(advertiser) das adOpsTeams a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de adOpsTeams
	 */
	public getAllAdOpsTeamsFrom(advertiser: string, adOpsTeam: string, userRequestPermission: string): Promise<string[]> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((users) => {
				if (userRequestPermission === 'adOpsTeamManager' || userRequestPermission === 'user') {
					return [adOpsTeam];
				}
				const adOpsTeamsToReturn: string[] = users
					.filter((user) => user.advertiser === advertiser)
					.map((filteredUsers) => {
						if (filteredUsers.adOpsTeam !== undefined && filteredUsers.adOpsTeam !== null) {
							return filteredUsers.adOpsTeam;
						} else {
							throw new Error('Nenhuma adOpsTeam encontrada!');
						}
					});
				return [...new Set(adOpsTeamsToReturn.filter((adOpsTeam) => adOpsTeam))];
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Retorna todos os usuários de uma determinada adOpsTeam
	 * @param advertiser Empresa(advertiser) dos usuários a serem buscados
	 * @param adOpsTeam adOpsTeam da qual usuários serão buscados
	 * @param requestUserid id do usuário que está fazendo o request
	 * @returns Lista de usuários
	 */

	public getAllUsersFromAdOpsTeam(
		advertiser: string,
		adOpsTeam: string,
		requestUserid: string
	): Promise<User[] | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const filteredUsers = allUsersDocuments.filter((user) => user.advertiser === advertiser);
				const users: User[] = [];
				if (filteredUsers.length > 0) {
					filteredUsers.forEach((user) => {
						const userAdOpsTeam = user.adOpsTeam;
						const userid = user.userid;
						if (userAdOpsTeam === adOpsTeam && userid !== requestUserid) {
							const userToPush = new User(
								user.userid,
								user.permission,
								user.advertiser,
								user.email,
								user.active,
								user.adOpsTeam
							);
							users.push(userToPush);
						}
					});
					return users;
				} else {
					throw new Error('Nenhum usuário encontrado!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}
