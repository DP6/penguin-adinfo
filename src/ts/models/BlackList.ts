import { CollectionReference, QuerySnapshot, WriteResult } from '@google-cloud/firestore';
import { FirestoreConnectionSingleton } from './cloud/FirestoreConnectionSingleton';
import { ObjectStore } from './DAO/ObjectStore';
import { JWT } from './JWT';

export class BlackList {
	private _objectStore: ObjectStore;
	private _collection: CollectionReference;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._collection = this._objectStore.getCollection(['blacklist']);
	}

	/**
	 * Adiciona um usuario na blacklist para logout
	 * @param token Token do usuario para logout
	 */
	public async addToken(token: string): Promise<void> {
		await this.clearBlacklist();
		this._objectStore.addDocumentIn(this._collection, {}, token);
	}

	/**
	 * Limpa a blacklist eliminando tokens expirados
	 */
	private clearBlacklist(): Promise<WriteResult[]> {
		const jwt = new JWT();
		return this._collection
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				const tokensToDelete: string[] = [];
				if (querySnapshot.size > 0) {
					querySnapshot.forEach((documentSnapshot) => {
						const token = documentSnapshot.ref.path.match(new RegExp('[^/]+$'))[0];
						const validateToken = jwt.verifyWithoutBlacklist(token);
						if (!validateToken) {
							tokensToDelete.push(token);
						}
					});
					return Promise.all(tokensToDelete.map((token: string) => this._collection.doc(token).delete()));
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Busca um token dentro da blacklist
	 * @param token token a ser buscado
	 * @returns retorna um boolean informando se o token foi encontrado
	 */
	public findToken(token: string): Promise<boolean | void> {
		return this._collection
			.where('__name__', '==', token)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					return true;
				} else {
					return false;
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}
