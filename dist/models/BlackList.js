'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.BlackList = void 0;
const FirestoreConnectionSingleton_1 = require('./cloud/FirestoreConnectionSingleton');
const JWT_1 = require('./JWT');
class BlackList {
	constructor() {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._collection = this._objectStore.getCollection(['blacklist']);
	}
	addToken(token) {
		return __awaiter(this, void 0, void 0, function* () {
			yield this.clearBlacklist();
			this._objectStore.addDocumentIn(this._collection, {}, token);
		});
	}
	clearBlacklist() {
		const jwt = new JWT_1.JWT();
		return this._collection
			.get()
			.then((querySnapshot) => {
				const tokensToDelete = [];
				if (querySnapshot.size > 0) {
					querySnapshot.forEach((documentSnapshot) => {
						const token = documentSnapshot.ref.path.match(new RegExp('[^/]+$'))[0];
						const validateToken = jwt.verifyWithoutBlacklist(token);
						if (!validateToken) {
							tokensToDelete.push(token);
						}
					});
					return Promise.all(tokensToDelete.map((token) => this._collection.doc(token).delete()));
				}
			})
			.catch((err) => {
				throw err;
			});
	}
	findToken(token) {
		return this._collection
			.where('__name__', '==', token)
			.get()
			.then((querySnapshot) => {
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
exports.BlackList = BlackList;
