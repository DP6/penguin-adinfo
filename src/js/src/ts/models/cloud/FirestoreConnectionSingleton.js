'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FirestoreConnectionSingleton = void 0;
const firestore_1 = require('@google-cloud/firestore');
const credentials = require('../../../../config/gcp_key.json');
const ObjectStore_1 = require('../DAO/ObjectStore');
class FirestoreConnectionSingleton extends ObjectStore_1.ObjectStore {
	constructor() {
		super();
		this._db = new firestore_1.Firestore({ credentials });
	}
	static getInstance() {
		if (!FirestoreConnectionSingleton._instance) {
			FirestoreConnectionSingleton._instance = new FirestoreConnectionSingleton();
		}
		return FirestoreConnectionSingleton._instance;
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
	addDocumentIn(collection, document, documentName) {
		let docRef;
		if (documentName) {
			docRef = collection.doc(documentName);
		} else {
			docRef = collection.doc();
		}
		docRef.set(document);
		return docRef;
	}
}
exports.FirestoreConnectionSingleton = FirestoreConnectionSingleton;
