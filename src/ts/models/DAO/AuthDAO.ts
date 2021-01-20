import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { Auth } from '../Auth';
import { CollectionReference } from '@google-cloud/firestore';

export class AuthDAO {
	private _token: string;
	private _objectStore: ObjectStore;
	private _authCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor(token: string) {
		this._token = token;
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(
			this._pathToCollection
		);
	}

	public getAuth(): Promise<Auth | void> {
		const pathToAuth = this._pathToCollection.concat(this._token);
		return this._objectStore
			.getDocument(pathToAuth)
			.get()
			.then((data) => {
				const jsonAuth = data.data();
				return new Auth(
					jsonAuth.permission,
					jsonAuth.company,
					jsonAuth.agency
				);
			})
			.catch((err) => console.log(err));
	}

	public addAuth(jsonAuth: {
		[key: string]: string;
	}): Promise<string | void> {
		return this._objectStore
			.addDocumentIn(this._authCollection, jsonAuth, '')
			.get()
			.then((data) => {
				return data.id;
			})
			.catch((err) => console.log(err));
	}
}
