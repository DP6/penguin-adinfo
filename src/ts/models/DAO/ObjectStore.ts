import {
	CollectionReference,
	DocumentReference,
	DocumentData,
} from '@google-cloud/firestore';

export abstract class ObjectStore {
	abstract getCollection(path: string[]): CollectionReference;
	abstract getDocument(path: string[]): DocumentReference;
	abstract getAllDocumentsFrom(
		collection: CollectionReference
	): Promise<DocumentData[]>;
	abstract addDocumentIn(
		collection: CollectionReference,
		document: { [key: string]: any }
	): void;
}
