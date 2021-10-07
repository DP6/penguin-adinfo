import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, QuerySnapshot, QueryDocumentSnapshot } from '@google-cloud/firestore';
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
	 * Retorna todos os usuários não owners da empresa
	 * @param company Empresa(company) dos usuários a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de usuários
	 */
	// public getAllUsersFrom(company: string, userRequestPermission: string): Promise<User[] | void> {
	// 	return this._objectStore
	// 		.getCollection(this._pathToCollection)
	// 		.where('company', '==', company)
	// 		.get()
	// 		.then((querySnapshot: QuerySnapshot) => {
	// 			if (querySnapshot.size > 0) {
	// 				const users: User[] = [];
	// 				querySnapshot.forEach((documentSnapshot) => {
	// 					const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
	// 					if (searchId) {
	// 						const userPermission = documentSnapshot.get('permission');
	// 						if (userPermission !== 'owner' || (userRequestPermission === 'admin' && userPermission === 'user')) {
	// 							const user = new User(
	// 								searchId[0],
	// 								userPermission,
	// 								documentSnapshot.get('company'),
	// 								documentSnapshot.get('email'),
	// 								documentSnapshot.get('activate'),
	// 								documentSnapshot.get('agency')
	// 							);
	// 							users.push(user);
	// 						}
	// 					} else {
	// 						throw new Error('Nenhum usuário encontrado!');
	// 					}
	// 				});
	// 				return users;
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			throw err;
	// 		});
	// }

	/**
	 * Consulta o usuario na base de dados
	 * @returns Retorna o usuario procurado
	 */
	// public getUser(): Promise<User | void> {
	// 	return this._objectStore
	// 		.getCollection(this._pathToCollection)
	// 		.where('email', '==', this._email)
	// 		.get()
	// 		.then((querySnapshot: QuerySnapshot) => {
	// 			if (querySnapshot.size > 0) {
	// 				let user: User;
	// 				querySnapshot.forEach((documentSnapshot) => {
	// 					const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
	// 					if (searchId) {
	// 						const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
	// 						if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
	// 						user = new User(
	// 							searchId[0],
	// 							documentSnapshot.get('permission'),
	// 							documentSnapshot.get('company'),
	// 							documentSnapshot.get('email'),
	// 							documentSnapshot.get('activate'),
	// 							documentSnapshot.get('agency')
	// 						);
	// 					} else {
	// 						throw new Error('Nenhum usuário encontrado!');
	// 					}
	// 				});
	// 				return user;
	// 			} else {
	// 				throw new Error('Email ou senha incorreto(s)!');
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			throw err;
	// 		});
	// }

	/**
	 * Adiciona uam nova campanha na base de dados
	 * @param campaign Campanha a ser adicionada
	 * @returns Booleano indicando sucesso ou fracasso da criação do usuário
	 */
	public addCampaign(campaign: Campaign): Promise<boolean> {
		return this._objectStore
			.addDocumentIn(this._authCollection, campaign.toJson(), campaign.name)
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
	 * Busca o ID do usuario na base de dados
	 * @returns ID do usuario
	 */
	// public getCampaignId(): Promise<string | void> {
	// 	return this._objectStore
	// 		.getCollection(this._pathToCollection)
	// 		.where('name', '==', this._email)
	// 		.get()
	// 		.then((querySnapshot: QuerySnapshot) => {
	// 			if (querySnapshot.size > 0) {
	// 				querySnapshot.forEach((documentSnapshot) => {
	// 					const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
	// 					const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
	// 					if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
	// 					if (searchId) {
	// 						return searchId[0];
	// 					} else {
	// 						throw new Error('Falha ao recuperar o ID do usuário');
	// 					}
	// 				});
	// 			} else {
	// 				throw new Error('ID não encontrado!');
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			throw err;
	// 		});
	// }

	/**
	 * Desativa uma campanha
	 * @param campaignName ID da campanha a ser desativada
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public deactivateCampaign(
		campaignName: string,
		agency: string,
		userRequestPermission: string
	): Promise<boolean | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(campaignName)
			.get()
			.then((doc: QueryDocumentSnapshot) => {
				const campaign = doc.data();
				if (
					campaign.agency === agency &&
					(userRequestPermission === 'admin' ||
						userRequestPermission === 'owner' ||
						userRequestPermission === 'agencyOwner')
				) {
					campaign.activate = false;
				} else {
					throw new Error('Permissões insuficientes para inavitar a campanha!');
				}
				return doc.ref.set(campaign);
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
	public reactivateCampaign(
		campaignName: string,
		agency: string,
		userRequestPermission: string
	): Promise<boolean | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(campaignName)
			.get()
			.then((doc: QueryDocumentSnapshot) => {
				const campaign = doc.data();
				if (
					campaign.agency === agency &&
					(userRequestPermission === 'admin' ||
						userRequestPermission === 'owner' ||
						userRequestPermission === 'agencyOwner')
				) {
					campaign.activate = true;
				} else {
					throw new Error('Permissões insuficientes para reativar a campanha!');
				}
				return doc.ref.set(campaign);
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
