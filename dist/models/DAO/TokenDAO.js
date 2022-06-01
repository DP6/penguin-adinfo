'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TokenDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const Token_1 = require('../Token');
class TokenDAO {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._token = this._objectStore.getCollection(['tokens']);
	}
	getToken(token) {
		return this._token
			.where('__name__', '==', token)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.size > 0) {
					let token;
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							token = new Token_1.Token(
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
exports.TokenDAO = TokenDAO;
