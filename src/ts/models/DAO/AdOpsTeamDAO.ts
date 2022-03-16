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
	 * Retorna todas os adOpsTeams de uma companhia
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
					.filter((user) => user.company === advertiser)
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
	 * @returns Lista de usuários
	 */
	public getAllUsersFromAdOpsTeam(advertiser: string, adOpsTeam: string): Promise<User[] | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('advertiser', '==', advertiser)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					const users: User[] = [];
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							const userPermission = documentSnapshot.get('permission');
							const userAdOpsTeam = documentSnapshot.get('adOpsTeam');
							if ((userPermission === 'adOpsTeamManager' || userPermission === 'user') && userAdOpsTeam === adOpsTeam) {
								const user = new User(
									searchId[0],
									userPermission,
									documentSnapshot.get('advertiser'),
									documentSnapshot.get('email'),
									documentSnapshot.get('active'),
									documentSnapshot.get('adOpsTeam')
								);
								users.push(user);
							}
						} else {
							throw new Error('Nenhum usuário encontrado!');
						}
					});
					return users;
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}
