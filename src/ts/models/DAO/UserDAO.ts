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
	 * @param company Empresa(company) dos usuários a serem buscados
	 * @param agency Agência da qual usuários serão buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de usuários
	 */
	public getAllUsersFrom(company: string, agency: string, userRequestPermission: string): Promise<User[] | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('company', '==', company)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				return this._objectStore.getUsersFromFirestore(querySnapshot, userRequestPermission, agency, true);
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
				return this._objectStore.getSingleUserFromFirestore(querySnapshot, this._password);
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
			.then((data) => {
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
				return this._objectStore.toggleUsersFromFirestore(doc, userRequestPermission, false);
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
				return this._objectStore.toggleUsersFromFirestore(doc, userRequestPermission, true);
			})
			.then(() => {
				return true;
			})
			.catch((err) => {
				throw err;
			});
	}
}
