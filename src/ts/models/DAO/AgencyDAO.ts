import { FirestoreConnectionSingleton } from '../cloud/FirestoreConnectionSingleton';
import { QuerySnapshot } from '@google-cloud/firestore';
import { ObjectStore } from './ObjectStore';

export class AgencyDAO {
	private _objectStore: ObjectStore;

	constructor() {
		this._objectStore = FirestoreConnectionSingleton.getInstance();
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
}
