import { ObjectStore } from './ObjectStore';
import { FirestoreConnection } from '../cloud/FirestoreConnection';
import { Auth } from '../Auth';
import { CollectionReference } from '@google-cloud/firestore';

export class AuthDAO {
	private _key: string;
	private _objectStore: ObjectStore;
	private _company: string;
	private _authCollection: CollectionReference;
	private _pathToCollection: string[];

	constructor(company: string, key: string) {
		this._key = key;
		this._company = company;
		this._objectStore = new FirestoreConnection();
		this._pathToCollection = ['companies', company, 'tokens'];
		this._authCollection = this._objectStore.getCollection(
			this._pathToCollection
		);
	}

	public getAuth(): Promise<Auth | void> {
		const pathToAuth = this._pathToCollection.concat(this._key);
		return this._objectStore
			.getDocument(pathToAuth)
			.get()
			.then((data) => {
				const jsonAuth = data.data();
				return new Auth(jsonAuth.permission, jsonAuth.agency);
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
