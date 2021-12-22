import {
	CollectionReference,
	DocumentReference,
	Firestore,
	DocumentData,
	QuerySnapshot,
	QueryDocumentSnapshot,
} from '@google-cloud/firestore';
import { ObjectStore } from '../DAO/ObjectStore';
import { User } from '../User';
import * as bcrypt from 'bcrypt';

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
	 * Busca todas as campanhas da agencia dada
	 * @param querySnapshot São os documentos que iremos acessar
	 * @param agency Agência referente as campanhas que serão buscadas
	 * @returns Lista de objetos com campanhas e seus atributos
	 */
	public getCampaignsFromFirestore(
		querySnapshot: QuerySnapshot,
		agency: string
	): { campaignName: string; campaignId: string; agency: string; activate: boolean }[] {
		if (querySnapshot.size > 0) {
			const agencia = agency !== 'Campanhas Internas' ? agency : 'CompanyCampaigns';
			const campaigns: { campaignName: string; campaignId: string; agency: string; activate: boolean }[] = [];
			querySnapshot.forEach((documentSnapshot) => {
				const documentAgency = documentSnapshot.get('agency');
				if (agencia === documentAgency) {
					const campaignInfos: { campaignName: string; campaignId: string; agency: string; activate: boolean } = {
						campaignName: documentSnapshot.get('name'),
						campaignId: documentSnapshot.get('campaignId'),
						agency: documentSnapshot.get('agency'),
						activate: documentSnapshot.get('activate'),
					};
					if (
						campaignInfos.campaignName &&
						campaignInfos.campaignId &&
						campaignInfos.agency &&
						campaignInfos.activate !== null &&
						campaignInfos.activate !== undefined &&
						!campaigns.includes(campaignInfos)
					) {
						campaigns.push(campaignInfos);
					} else {
						throw new Error('Erro na recuperação dos atributos da campanha ' + documentSnapshot.get('name') + '!');
					}
				} else {
					throw new Error('Nenhuma campanha encontrada!');
				}
			});
			return campaigns;
		}
	}

	/**
	 * Ativa ou desativa uma campanha no Firestore
	 * @param querySnapshot São os documentos que iremos acessar
	 * @param userRequestPermission A permissão de usuário de quem está invocando a função
	 * @param activateStatus Marcação referente a reativação ou desativação da campanha
	 * @returns Retorna objeto com os atributos da campanha com seu novo status de ativado ou desativado
	 */
	public toggleCampaignsFromFirestore(
		querySnapshot: QuerySnapshot,
		userRequestPermission: string,
		activateStatus: boolean
	): { agency: string; name: string; campaignId: string; created: string; company: string; activate: boolean } {
		if (querySnapshot) {
			let finalCampaignObject;
			querySnapshot.forEach((doc) => {
				const campaign = doc.data();
				if (userRequestPermission !== 'user') {
					campaign.activate = activateStatus;
				} else {
					throw new Error('Permissões insuficientes para reativar a campanha!');
				}
				finalCampaignObject = doc.ref.set(campaign);
			});
			return finalCampaignObject;
		} else {
			throw new Error('ID não encontrado!');
		}
	}

	/**
	 * Ativa ou desativa um usuário no Firestore
	 * @param querySnapshot São os documentos que iremos acessar
	 * @param userRequestPermission A permissão de usuário de quem está invocando a função
	 * @param activateStatus Marcação referente a reativação ou desativação do usuário
	 * @returns Booleano referente ao sucesso ou fracasso da operação
	 */
	public async toggleUsersFromFirestore(
		doc: QueryDocumentSnapshot,
		userRequestPermission: string,
		activateStatus: boolean
	): Promise<boolean> {
		const user = doc.data();
		let operationSucceeeded;
		if (
			user.permission === 'user' ||
			((user.permission === 'admin' || user.permission === 'agencyOwner') && userRequestPermission === 'owner')
		) {
			user.activate = activateStatus;
		} else if (user.permission === 'agencyOwner' && userRequestPermission === 'admin') {
			user.activate = activateStatus;
		} else {
			throw new Error('Permissões insuficientes para inativar o usuário!');
		}

		try {
			await doc.ref.set(user);
			operationSucceeeded = true;
		} catch (e) {
			operationSucceeeded = false;
		}
		return operationSucceeeded;
	}

	/**
	 * Busca todas os usuários da companhia ou de uma agência
	 * @param querySnapshot São os documentos que iremos acessar
	 * @param userRequestPermission A permissão de usuário de quem está invocando a função
	 * @param agency Agência dos usuários buscados
	 * @param isFromCompany Marcação para sabermos se a função será invocada para trazer usuários de toda a compania, ou apenas de uma agência
	 * @returns Array contendo todos os usuários encontrados e seus atributos
	 */
	public getUsersFromFirestore(
		querySnapshot: QuerySnapshot,
		userRequestPermission: string,
		agency: string,
		isFromCompany: boolean
	): User[] {
		if (querySnapshot.size > 0) {
			let conditionToGetUser: boolean;
			const users: User[] = [];
			querySnapshot.forEach((documentSnapshot) => {
				const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
				if (searchId) {
					const userAgency = documentSnapshot.get('agency');
					const userPermission = documentSnapshot.get('permission');
					isFromCompany
						? (conditionToGetUser =
								userPermission !== 'owner' || (userRequestPermission === 'admin' && userPermission === 'user'))
						: (userPermission === 'agencyOwner' || userPermission === 'user') && userAgency === agency;
					if (conditionToGetUser) {
						const user = new User(
							searchId[0],
							userPermission,
							documentSnapshot.get('company'),
							documentSnapshot.get('email'),
							documentSnapshot.get('activate'),
							documentSnapshot.get('agency')
						);
						users.push(user);
					}
				} else {
					throw new Error('Nenhum usuário encontrado!');
				}
			});
			return users;
		}
	}

	/**
	 * Busca todas os usuários da companhia ou de uma agência
	 * @param querySnapshot São os documentos que iremos acessar
	 * @param password Senha do usuário a ser buscado
	 * @returns Usuário do tipo User com seus atributos
	 */
	public getSingleUserFromFirestore(querySnapshot: QuerySnapshot, password: string): User {
		if (querySnapshot.size > 0) {
			let user: User;
			querySnapshot.forEach((documentSnapshot) => {
				const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
				if (searchId) {
					const validatePassword = bcrypt.compareSync(password, documentSnapshot.get('password'));
					if (!validatePassword) throw new Error('Email ou senha incorreto(s)!');
					user = new User(
						searchId[0],
						documentSnapshot.get('permission'),
						documentSnapshot.get('company'),
						documentSnapshot.get('email'),
						documentSnapshot.get('activate'),
						documentSnapshot.get('agency')
					);
				} else {
					throw new Error('Nenhum usuário encontrado!');
				}
			});
			return user;
		} else {
			throw new Error('Email ou senha incorreto(s)!');
		}
	}

	/**
	 * Busca todas os usuários da companhia ou de uma agência
	 * @param querySnapshot São os documentos que iremos acessar
	 * @param agency Agência dos usuários buscados
	 * @param userRequestPermission A permissão de usuário de quem está invocando a função
	 * @param isFromCompany Marcação para sabermos se a função será invocada para trazer usuários de toda a compania, ou apenas de uma agência
	 * @returns Array contendo todos os usuários encontrados e seus atributos
	 */
	public getAllAgenciesFromFirestore(
		querySnapshot: QuerySnapshot,
		agency: string,
		userRequestPermission: string
	): string[] {
		if (querySnapshot.size > 0) {
			if (userRequestPermission === 'agencyOwner' || userRequestPermission === 'user') {
				return [agency];
			}
			const agencies: string[] = [];
			querySnapshot.forEach((documentSnapshot) => {
				const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
				if (searchId) {
					const userAgency = documentSnapshot.get('agency');
					if (userAgency && !agencies.includes(userAgency)) {
						agencies.push(userAgency);
					}
				} else {
					throw new Error('Nenhuma agência encontrada!');
				}
			});
			return agencies;
		}
	}
}
