import {
	CollectionReference,
	DocumentReference,
	DocumentData,
	WriteResult,
	DocumentSnapshot,
	WhereFilterOp,
	QuerySnapshot,
} from '@google-cloud/firestore';

export abstract class ObjectStore {
	abstract getCollection(path: string[]): CollectionReference;
	abstract getDocument(path: string[]): DocumentReference;
	abstract getAllDocumentsFrom(collection: CollectionReference): Promise<DocumentData[]>;
	abstract addDocumentIn(
		collection: CollectionReference,
		document: { [key: string]: any },
		documentName: string
	): DocumentReference;
	abstract getDocumentById(collection: CollectionReference, id: string): Promise<DocumentSnapshot<DocumentData>>;
	abstract updateDocumentById(
		collection: CollectionReference,
		id: string,
		updateData: { [key: string]: any }
	): Promise<WriteResult>;
	abstract deleteDocumentById(collection: CollectionReference, id: string): Promise<WriteResult>;
	abstract getDocumentFiltered(
		collection: CollectionReference,
		conditions: { key: string; operator: WhereFilterOp; value: string | number | boolean }[]
	): Promise<QuerySnapshot<DocumentData>>;
	abstract documentExists(
		collection: CollectionReference,
		conditions: { key: string; operator: WhereFilterOp; value: string | number | boolean }[]
	): Promise<boolean>;
}
