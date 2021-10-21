import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { CollectionReference, QuerySnapshot, QueryDocumentSnapshot } from '@google-cloud/firestore';
import { ObjectStore } from './ObjectStore';
import { User } from '../User';

export class AgencyDAO {
	private _objectStore: ObjectStore;
	private _pathToCollection: string[];
	private _authCollection: CollectionReference;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
		this._authCollection = this._objectStore.getCollection(this._pathToCollection);
	}

	/**
	 * Retorna todas as agências de uma companhia
	 * @param company Empresa(company) das agências a serem buscados
	 * @param agency Empresa(company) das agências a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de agências
	 */
	public getAllAgenciesFrom(company: string, agency: string, userRequestPermission: string): Promise<string[] | void> {
		return this._objectStore
			.getCollection(['tokens'])
			.where('company', '==', company)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
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
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Retorna todos os usuários de uma determinada agência
	 * @param company Empresa(company) dos usuários a serem buscados
	 * @param agency Agência da qual usuários serão buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de usuários
	 */
	public getAllUsersFromAgency(company: string, agency: string, userRequestPermission: string): Promise<User[] | void> {
		return this._objectStore
			.getCollection(this._pathToCollection)
			.where('company', '==', company)
			.get()
			.then((querySnapshot: QuerySnapshot) => {
				if (querySnapshot.size > 0) {
					const users: User[] = [];
					querySnapshot.forEach((documentSnapshot) => {
						const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
						if (searchId) {
							const userPermission = documentSnapshot.get('permission');
							const userAgency = documentSnapshot.get('agency');
							if ((userPermission === 'agencyOwner' || userPermission === 'user') && userAgency === agency) {
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
			})
			.catch((err) => {
				throw err;
			});
	}
}
