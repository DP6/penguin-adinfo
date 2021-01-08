import { ObjectStore } from './ObjectStore';
import { FirestoreConnection } from '../cloud/FirestoreConnection';
import { Auth } from '../Auth';

export class AuthDAO {
	private _key: string;
	private _objectStore: ObjectStore;
	private _company: string;

	constructor(company: string, key: string) {
		this._key = key;
		this._company = company;
		this._objectStore = new FirestoreConnection();
	}

	public getAuth(): Promise<Auth | void> {
		const pathToAuth = ['companies', this._company, 'tokens', this._key];
		return this._objectStore
			.getDocument(pathToAuth)
			.get()
			.then((data) => {
				const jsonAuth = data.data();
				return new Auth(jsonAuth.permission, jsonAuth.agency);
			})
			.catch((err) => console.log(err));
	}
}
