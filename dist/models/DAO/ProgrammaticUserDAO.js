'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProgrammaticUserDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const ProgrammaticUser_1 = require('../ProgrammaticUser');
class ProgrammaticUserDAO {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._programmaticUser = this._objectStore.getCollection(['tokens_programaticos']);
	}
	getProgrammaticUser(token) {
		return this._programmaticUser
			.where('__name__', '==', token)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.size > 0) {
					let programmaticUser;
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							programmaticUser = new ProgrammaticUser_1.ProgrammaticUser(
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
exports.ProgrammaticUserDAO = ProgrammaticUserDAO;
