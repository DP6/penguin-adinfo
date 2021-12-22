import {
	CollectionReference,
	DocumentReference,
	DocumentData,
	QuerySnapshot,
	QueryDocumentSnapshot,
} from '@google-cloud/firestore';
import { User } from '../User';

export abstract class ObjectStore {
	abstract getCollection(path: string[]): CollectionReference;
	abstract getDocument(path: string[]): DocumentReference;
	abstract getAllDocumentsFrom(collection: CollectionReference): Promise<DocumentData[]>;
	abstract addDocumentIn(
		collection: CollectionReference,
		document: { [key: string]: any },
		documentName: string
	): DocumentReference;
	abstract getCampaignsFromFirestore(
		querySnapshot: QuerySnapshot,
		agency: string
	): { campaignName: string; campaignId: string; agency: string; activate: boolean }[];
	abstract getUsersFromFirestore(
		querySnapshot: QuerySnapshot,
		userRequestPermission: string,
		agency: string,
		isFromCompany: boolean
	): User[];
	abstract toggleCampaignsFromFirestore(
		querySnapshot: QuerySnapshot,
		userRequestPermission: string,
		activateStatus: boolean
	): { agency: string; name: string; campaignId: string; created: string; company: string; activate: boolean };
	abstract toggleUsersFromFirestore(
		doc: QueryDocumentSnapshot,
		userRequestPermission: string,
		activateStatus: boolean
	): Promise<boolean>;
	abstract getSingleUserFromFirestore(querySnapshot: QuerySnapshot, password: string): User;
	abstract getAllAgenciesFromFirestore(
		querySnapshot: QuerySnapshot,
		agency: string,
		userRequestPermission: string
	): string[];
}
