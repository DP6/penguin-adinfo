import { ObjectStore } from '../DAO/ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, DocumentData, DocumentReference } from '@google-cloud/firestore';
import { ProgrammaticUser } from '../ProgrammaticUser'

export class ConfigDAO {
	private _objectStore: ObjectStore;
	private _programmaticUser: CollectionReference;

	constructor(programmaticToken: string) {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._programmaticUser = this._objectStore.getCollection([]);
	}

    getProgrammaticUser(token: string): ProgrammaticUser {
        //IMPLEMENTAR
    }

}
