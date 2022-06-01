import { ObjectStore } from './ObjectStore';
import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore';
import { Token } from '../Token';

export class TokenDAO {
	private _objectStore: ObjectStore;
	private _token: CollectionReference;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._token = this._objectStore.getCollection(['tokens']);
	}

	getToken(token: string): Promise<Token> {
		return this._token
			.where('__name__', '==', token)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					let token: Token;
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							token = new Token(
								searchId[0],
								documentSnapshot.get('permission'),
								documentSnapshot.get('advertiser'),
								documentSnapshot.get('email'),
								documentSnapshot.get('active'),
								documentSnapshot.get('adOpsTeam')
							);
						} else {
							throw new Error('Nenhum token encontrado!');
						}
					});
					return token;
				} else {
					throw new Error('Nenhum token encontrado!');
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}
