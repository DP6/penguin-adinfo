import {
	CollectionReference,
	DocumentReference,
	Firestore,
	DocumentData,
} from '@google-cloud/firestore';
import * as credentials from '../../../../config/gcp_key.json';
import { ObjectStore } from '../DAO/ObjectStore';
import { Config } from '../Config';

export class FirestoreConnection extends ObjectStore {
	private _db: Firestore;

	constructor() {
		super();
		this._db = new Firestore({ credentials });
	}

	/**
	 * Pega uma determinada coleção no Firestore
	 * @param path array contendo a sequencia de coleção > documento
	 */
	public getCollection(path: string[]): CollectionReference {
		let c: CollectionReference;
		let d: DocumentReference;
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

	/**
	 * Pega um determinado documento no Firestore
	 * @param path array contendo a sequencia de coleção > documento
	 */
	public getDocument(path: string[]): DocumentReference {
		let c: CollectionReference;
		let d: DocumentReference;
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

	/**
	 * Pega todos os documentos de uma coleção
	 * @param collection Coleção contendo os documentos desejados
	 */
	public getAllDocumentsFrom(
		collection: CollectionReference
	): Promise<DocumentData[]> {
		return new Promise((resolve, reject) => {
			collection
				.get()
				.then((snapshot) => {
					const docs: DocumentData[] = [];
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

	/**
	 * Adiciona um documento à uma coleção
	 * @param collection Coleção de referência
	 * @param document Documento a ser inserido à coleção
	 */
	public addDocumentIn(
		collection: CollectionReference,
		document: Config
	): void {
		const docRef = collection.doc(`config_${document.version}`);
		docRef.set(document.toJson());
	}
}
