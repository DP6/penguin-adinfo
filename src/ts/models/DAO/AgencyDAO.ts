import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { QuerySnapshot } from '@google-cloud/firestore';
import { ObjectStore } from './ObjectStore';
import { User } from '../User';

export class AgencyDAO {
	private _objectStore: ObjectStore;
	private _pathToCollection: string[];

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
		this._pathToCollection = ['tokens'];
	}

	/**
	 * Retorna todas as agências de uma companhia
	 * @param company Empresa(company) das agências a serem buscados
	 * @param agency Empresa(company) das agências a serem buscados
	 * @param userRequestPermission permissão do usuario que solicitou a alteração
	 * @returns Lista de agências
	 */
	public getAllAgenciesFrom(company: string, agency: string, userRequestPermission: string): Promise<string[]> {
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
				return this._objectStore.getUsersFromFirestore(querySnapshot, userRequestPermission, agency, false);
			})
			.catch((err) => {
				throw err;
			});
	}
}
