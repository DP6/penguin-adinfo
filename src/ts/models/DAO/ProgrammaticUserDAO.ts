import { ObjectStore } from '../DAO/ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore';
import { ProgrammaticUser } from '../ProgrammaticUser';

export class ProgrammaticUserDAO {
	private _objectStore: ObjectStore;
	private _programmaticUser: CollectionReference;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._programmaticUser = this._objectStore.getCollection(['tokens_programaticos']);
	}

	getProgrammaticUser(token: string): Promise<ProgrammaticUser> {
		return this._programmaticUser
			.where('__name__', '==', token)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					let programmaticUser: ProgrammaticUser;
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							programmaticUser = new ProgrammaticUser(
								searchId[0],
								documentSnapshot.get('permission'),
								documentSnapshot.get('company'),
								documentSnapshot.get('email'),
								documentSnapshot.get('activate'),
								documentSnapshot.get('agency')
							);
						} else {
							throw new Error('Nenhum token encontrado!');
						}
					});
					return programmaticUser;
				} else {
					throw new Error('Nenhum token encontrado!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}
