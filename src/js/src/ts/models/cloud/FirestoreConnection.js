'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FirestoreConnection = void 0;
const firestore_1 = require('@google-cloud/firestore');
const credentials = require('../../../../config/gcp_key.json');
const ObjectStore_1 = require('../DAO/ObjectStore');
class FirestoreConnection extends ObjectStore_1.ObjectStore {
	constructor() {
		super();
		this._db = new firestore_1.Firestore({ credentials });
	}
	getCollection(path) {
		let c;
		let d;
		path.forEach((step, index) => {
			if (index % 2 === 0) {
				if (index === 0) c = this._db.collection(step);
				else c = d.collection(step);
			} else {
				d = c.doc(step);
			}
		});
		return c;
	}
	getDocument(path) {
		let c;
		let d;
		path.forEach((step, index) => {
			if (index % 2 === 0) {
				if (index === 0) c = this._db.collection(step);
				else c = d.collection(step);
			} else {
				d = c.doc(step);
			}
		});
		return d;
	}
	getAllDocumentsFrom(collection) {
		return new Promise((resolve, reject) => {
			collection
				.get()
				.then((snapshot) => {
					const docs = [];
					snapshot.forEach((doc) => {
						docs.push(doc.data());
					});
					resolve(docs);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	addDocumentIn(collection, document) {
		const docRef = collection.doc(`config_${document.version}`);
		docRef.set(document);
	}
}
exports.FirestoreConnection = FirestoreConnection;
