import {
	CollectionReference,
	DocumentReference,
	Firestore,
	DocumentData,
	WriteResult,
	DocumentSnapshot,
	WhereFilterOp,
	QuerySnapshot,
	Query,
} from '@google-cloud/firestore';
import { ObjectStore } from '../DAO/ObjectStore';

export class FirestoreConnectionSingleton extends ObjectStore {
	private _db: Firestore;
	private static _instance: FirestoreConnectionSingleton;
	private constructor() {
		super();
		if (process.env.ENV === 'development') {
			this._db = new Firestore({
				projectId: process.env.GCP_PROJECT_ID,
				credentials: JSON.parse(process.env.GCP_KEY),
			});
		} else {
			this._db = new Firestore();
		}
	}

	/**
	 * Retorna a instancia atual da classe
	 */
	public static getInstance(): FirestoreConnectionSingleton {
		if (!FirestoreConnectionSingleton._instance) {
			FirestoreConnectionSingleton._instance = new FirestoreConnectionSingleton();
		}
		return FirestoreConnectionSingleton._instance;
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
	public getAllDocumentsFrom(collection: CollectionReference): Promise<DocumentData[]> {
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
	 * @param documentName Nome do documento no Firestore, caso não seja necessário o uso do ID automático
	 */
	public addDocumentIn(
		collection: CollectionReference,
		document: { [key: string]: any },
		documentName: string
	): DocumentReference {
		let docRef: DocumentReference;
		if (documentName) {
			docRef = collection.doc(documentName);
		} else {
			docRef = collection.doc();
		}
		docRef.set(document);
		return docRef;
	}

	/**
	 * Pega um documento no Banco de Documentos pelo ID
	 * @param collection Coleção onde o documento se encontra
	 * @param id ID do documento
	 * @returns Documento selecionado
	 */
	public getDocumentById(collection: CollectionReference, id: string): Promise<DocumentSnapshot<DocumentData>> {
		return collection.doc(id).get();
	}

	/**
	 * Atualiza os valores de um documento no banco de Documentos
	 * @param collection Coleção onde está o documento
	 * @param id ID do documento
	 * @param updateData Campos a serem atualizados
	 * @returns Documento Atualizado
	 */
	public updateDocumentById(
		collection: CollectionReference,
		id: string,
		updateData: { [key: string]: any }
	): Promise<WriteResult> {
		return collection.doc(id).update(updateData);
	}

	/**
	 * Retorna documentos do Banco de Documentos a partir de filtros
	 * @param collection Coleção onde estão os documentos
	 * @param conditions Condições de filtragem
	 * @returns Documentos filtrados
	 */
	public getDocumentFiltered(
		collection: CollectionReference,
		conditions: { key: string; operator: WhereFilterOp; value: string | number | boolean }[]
	): Promise<QuerySnapshot<DocumentData>> {
		let query: Query<DocumentData>;
		for (let i = 0; i < conditions.length; i++) {
			if (i == 0) query = collection.where(conditions[i].key, conditions[i].operator, conditions[i].value);
			else query = query.where(conditions[i].key, conditions[i].operator, conditions[i].value);
		}
		return query.get();
	}

	/**
	 * Deleta um documento no banco de Documentos
	 * @param collection Coleção onde está o documento
	 * @param id ID do documento
	 * @returns Documento deletado
	 */
	public deleteDocumentById(collection: CollectionReference, id: string): Promise<WriteResult> {
		return collection.doc(id).delete();
	}

	/**
	 * Valida se existe algum documento de acordo com as condições especificadas
	 * @param collection Coleção onde estão os documentos
	 * @param conditions Condições de filtragem
	 * @returns Boolean
	 */

	public documentExists(
		collection: CollectionReference,
		conditions: { key: string; operator: WhereFilterOp; value: string | number | boolean }[]
	): Promise<boolean> {
		return this.getDocumentFiltered(collection, conditions)
			.then((documents) => documents.docs.length > 0)
			.catch((err) => {
				throw err;
			});
	}
}
