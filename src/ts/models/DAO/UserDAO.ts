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
	 * Busca o ID do usuario na base de dados
	 * @returns ID do usuario
	 */
	public getUserId(): Promise<string | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('email', '==', this._email)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
						if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
						if (searchId) {
							return searchId[0];
						} else {
							throw new Error('Falha ao recuperar o ID do usuário');
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
	 * Retorna todos os usuários não owners da empresa
	 * @param advertiser Empresa(advertiser) dos usuários a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de usuários
	 */
	public getAllUsersFrom(advertiser: string, userRequestPermission: string): Promise<User[] | void> {
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
							if (userPermission !== 'owner' || (userRequestPermission === 'admin' && userPermission === 'user')) {
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

	/**
	 * Consulta o usuario na base de dados
	 * @returns Retorna o usuario procurado
	 */
	public getUser(): Promise<User | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('email', '==', this._email)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					let user: User;
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
							if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
							user = new User(
								searchId[0],
								documentSnapshot.get('permission'),
								documentSnapshot.get('advertiser'),
								documentSnapshot.get('email'),
								documentSnapshot.get('active'),
								documentSnapshot.get('adOpsTeam')
							);
						} else {
							throw new Error('Nenhum usuário encontrado!');
						}
					});
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
			.getCollection(this._pathToCollection)
			.doc(userId)
			.get()
			.then((doc: QueryDocumentSnapshot) => {
				const user = doc.data();
				if (
					user.permission === 'user' ||
					((user.permission === 'admin' || user.permission === 'adOpsManager') && userRequestPermission === 'owner')
				) {
					user.active = false;
				} else if (user.permission === 'adOpsManager' && userRequestPermission === 'admin') {
					user.active = false;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return doc.ref.set(user);
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
	 * @param userId ID do usuário a ser resativado
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns retorna True em caso de sucesso
	 */
	public reactivateUser(userId: string, userRequestPermission: string): Promise<boolean | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.doc(userId)
			.get()
			.then((doc: QueryDocumentSnapshot) => {
				const user = doc.data();
				if (
					user.permission === 'user' ||
					((user.permission === 'admin' || user.permission === 'adOpsManager') && userRequestPermission === 'owner')
				) {
					user.active = true;
				} else if (user.permission === 'adOpsManager' && userRequestPermission === 'admin') {
					user.active = true;
				} else {
					throw new Error('Permissões insuficientes para inavitar o usuário!');
				}
				return doc.ref.set(user);
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
