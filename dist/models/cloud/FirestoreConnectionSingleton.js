'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FirestoreConnectionSingleton = void 0;
const firestore_1 = require('@google-cloud/firestore');
const ObjectStore_1 = require('../DAO/ObjectStore');
class FirestoreConnectionSingleton extends ObjectStore_1.ObjectStore {
	constructor() {
		super();
		if (process.env.ENV === 'development') {
			this._db = new firestore_1.Firestore({
				projectId: process.env.GCP_PROJECT_ID,
				credentials: JSON.parse(process.env.GCP_KEY),
			});
		} else {
			this._db = new firestore_1.Firestore();
		}
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
	getDocumentById(collection, id) {
		return collection.doc(id).get();
	}
	updateDocumentById(collection, id, updateData) {
		return collection.doc(id).update(updateData);
	}
	getDocumentFiltered(collection, conditions) {
		let query;
		for (let i = 0; i < conditions.length; i++) {
			if (i == 0) query = collection.where(conditions[i].key, conditions[i].operator, conditions[i].value);
			else query = query.where(conditions[i].key, conditions[i].operator, conditions[i].value);
		}
		return query.get();
	}
	documentExists(collection, conditions) {
		return this.getDocumentFiltered(collection, conditions)
			.then((documents) => documents.docs.length > 0)
			.catch((err) => {
				throw err;
			});
	}
}
exports.FirestoreConnectionSingleton = FirestoreConnectionSingleton;
