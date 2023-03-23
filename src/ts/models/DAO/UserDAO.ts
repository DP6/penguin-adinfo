import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { User } from '../User';
import { CollectionReference, QueryDocumentSnapshot, WhereFilterOp } from '@google-cloud/firestore';
import * as bcrypt from 'bcrypt';
import e = require('express');
import { use } from 'chai';
import user from '../../routes/user';

export class UserDAO {
	private _email: string;
	private _password: string;
	private _objectStore: ObjectStore;
	private _userCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor(email?: string, password?: string) {
		this._email = email;
		this._password = password;
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['users'];
		this._userCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Retorna todos os usuários não owners da empresa
	 * @param advertiser Empresa(advertiser) dos usuários a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de usuários
	 */
	public getAllUsersFrom(advertiser: string): Promise<User[] | void> {
		return this._objectStore
			.getAllDocumentsFrom(this._userCollection)
			.then((allUsersDocuments) => {
				const users: User[] = [];
				const allAdvertiserUsers = allUsersDocuments.filter((user) => user.advertiser === advertiser);
				if (allAdvertiserUsers.length > 0) {
					allAdvertiserUsers.forEach((advertiserUser) => {
						if (advertiserUser.permission === 'user') {
							const user = new User(
								advertiserUser.userid,
								advertiserUser.permission,
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
	 * Pega todos os usuários de um adOpsTeam
	 * @param advertiserId advertiser dos usuários a serem selecionados
	 * @param adOpsTeamId AdOpsTeam dos usuários a serem selecionados
	 * @returns Lista de usuários do AdOpsTeam especificado
	 */
	public getAllUsersFromAdOpsTeam(advertiserId: string, adOpsTeamId: string): Promise<User[]> {
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
			.getDocumentFiltered(this._userCollection, conditions)
			.then((usersDocuments) => {
				const users: User[] = [];
				usersDocuments.docs.map((userDocument) => {
					users.push(
						new User(
							userDocument.get('id'),
							userDocument.get('permission'),
							userDocument.get('advertiser'),
							userDocument.get('email'),
							userDocument.get('active'),
							userDocument.get('adOpsTeam')
						)
					);
				});
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
			.getAllDocumentsFrom(this._userCollection)
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
	 * Consulta o usuario na base de dados
	 * @param userId Usuario que será buscado
	 * @returns Retorna o usuario procurado
	 */
	public getUserById(userId: string): Promise<User | void> {
		return this._objectStore
			.getDocumentById(this._userCollection, userId)
			.then((userDocument) => {
				const user: User = new User(
					userDocument.get('id'),
					userDocument.get('permission'),
					userDocument.get('advertiser'),
					userDocument.get('email'),
					userDocument.get('active'),
					userDocument.get('adOpsTeam')
				);

				return user;
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Checa se o email inserido consta na base de dados
	 * @param email Email a ser checado
	 * @returns retorna True se o usuario ja existir na base de dados, do contrario retorna False.
	 */

	public userExists(email?: string): Promise<boolean> {
		const equal: WhereFilterOp = '==';
		const conditions = [
			{
				key: 'email',
				operator: equal,
				value: email,
			},
		];
		return this._objectStore.documentExists(this._userCollection, conditions);
	}

	/**
	 * Adiciona um novo usuario na base de dados
	 * @param user Usuario a ser adicionado
	 * @returns ID do novo usuario
	 */
	public addUser(user: User): Promise<string | void> {
		return this._objectStore
			.addDocumentIn(this._userCollection, user.toJsonSave(), '')
			.get()
			.then(async (data) => {
				await this._userCollection.doc(data.id).update({ userid: data.id });
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
	 * Deleta um usuario
	 * @param userId Usuario que será deletado
	 * @returns Retorna True caso o usuario tenha sido deletado com sucesso
	 */
	public deleteUser(userId: string): Promise<boolean> {
		return this._objectStore
			.deleteDocumentById(this._userCollection, userId)
			.then(() => {
				return true;
			})
			.catch(() => {
				return false;
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
			.getAllDocumentsFrom(this._userCollection)
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
			.getAllDocumentsFrom(this._userCollection)
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
}
