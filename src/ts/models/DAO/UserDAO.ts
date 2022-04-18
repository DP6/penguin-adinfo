import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { User } from '../User';
import { CollectionReference, QuerySnapshot, QueryDocumentSnapshot } from '@google-cloud/firestore';
import * as bcrypt from 'bcrypt';

export class UserDAO {
	private _email: string;
	private _password: string;
	private _objectStore: ObjectStore;
	private _authCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor(email?: string, password?: string) {
		this._email = email;
		this._password = password;
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Retorna todos os usuários não owners da empresa
	 * @param advertiser Empresa(advertiser) dos usuários a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de usuários
	 */
	public getAllUsersFrom(advertiser: string, userRequestPermission: string): Promise<User[] | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const users: User[] = [];
				const allAdvertiserUsers = allUsersDocuments.filter((user) => user.advertiser === advertiser);
				if (allAdvertiserUsers.length > 0) {
					allAdvertiserUsers.forEach((advertiserUser) => {
						if (
							advertiserUser.permission !== 'owner' ||
							(userRequestPermission === 'admin' && advertiserUser.permission === 'user')
						) {
							const user = new User(
								advertiserUser.userid,
								advertiserUser.advertiser,
								advertiserUser.email,
								advertiserUser.active,
								advertiserUser.adOpsTeam
							);
							users.push(user);
						}
					});
				} else {
					throw new Error('Nenhum usuário encontrado!');
				}
				return users;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Consulta o usuario na base de dados
	 * @returns Retorna o usuario procurado
	 */
	public getUser(): Promise<User | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				if (allUsersDocuments.length > 0) {
					const [userToValidate] = allUsersDocuments.filter((user) => user.email === this._email);
					const validatePassword = bcrypt.compareSync(this._password, userToValidate.password);
					if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');

					const user: User = new User(
						userToValidate.userid,
						userToValidate.permission,
						userToValidate.advertiser,
						userToValidate.email,
						userToValidate.active,
						userToValidate.adOpsTeam
					);

					return user;
				} else {
					throw new Error('Email ou senha incorreto(s)!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Adiciona um novo usuario na base de dados
	 * @param user Usuario a ser adicionado
	 * @returns ID do novo usuario
	 */
	public addUser(user: User): Promise<string | void> {
		return this._objectStore
			.addDocumentIn(this._authCollection, user.toJsonSave(), '')
			.get()
			.then(async (data) => {
				await this._authCollection.doc(data.id).update({ userid: data.id });
				return data.id;
			})
			.catch((err) => console.log(err));
	}

	/**
	 * Altera a senha do usuario
	 * @param user Usuario que terá a senha alterada
	 * @returns Retorna True caso a senha tenha sido alterada com sucesso
	 */
	public changePassword(user: User): Promise<boolean | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(user.id)
			.get()
			.then((doc: QueryDocumentSnapshot) => {
				return doc.ref.set(user.toJsonSave());
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Desativa um usuário
	 * @param userId ID do usuário a ser desativado
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */

	public deactivateUser(userId: string, userRequestPermission: string): Promise<boolean | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const [userToDeactivate] = allUsersDocuments.filter((user) => user.userid === userId);
				if (
					userToDeactivate.permission === 'user' ||
					((userToDeactivate.permission === 'admin' || userToDeactivate.permission === 'adOpsManager') &&
						userRequestPermission === 'owner')
				) {
					userToDeactivate.active = false;
				} else if (userToDeactivate.permission === 'adOpsManager' && userRequestPermission === 'admin') {
					userToDeactivate.active = false;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return userToDeactivate;
			})
			.then((userToDeactivate) => {
				this._objectStore.getCollection(this._pathToCollection).doc(userToDeactivate.userid).update(userToDeactivate);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Resativa um usuário
	 * @param userId ID do usuário a ser resativado
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */

	public reactivateUser(userId: string, userRequestPermission: string): Promise<boolean | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((allUsersDocuments) => {
				const [userToReactivate] = allUsersDocuments.filter((user) => user.userid === userId);
				if (
					userToReactivate.permission === 'user' ||
					((userToReactivate.permission === 'admin' || userToReactivate.permission === 'adOpsManager') &&
						userRequestPermission === 'owner')
				) {
					userToReactivate.active = true;
				} else if (userToReactivate.permission === 'adOpsManager' && userRequestPermission === 'admin') {
					userToReactivate.active = true;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return userToReactivate;
			})
			.then((userToReactivate) => {
				this._objectStore.getCollection(this._pathToCollection).doc(userToReactivate.userid).update(userToReactivate);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}

	public reactivateCampaign(campaignId: string, userRequestPermission: string): Promise<boolean | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._authCollection)
			.then((campaigns) => {
				if (userRequestPermission !== 'user') {
					const [filteredCampaign] = campaigns.filter((campaign) => campaign.campaignId === campaignId);
					filteredCampaign.active = true;
					return filteredCampaign;
				} else {
					throw new Error('Permissões insuficientes para inavitar a campanha!');
				}
			})
			.then((filteredCampaign) => {
				this._objectStore
					.getCollection(this._pathToCollection)
					.doc(`${filteredCampaign.name} - ${filteredCampaign.adOpsTeam}`)
					.update(filteredCampaign);
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
