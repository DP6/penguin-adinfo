import { ObjectStore } from '../DAO/ObjectStore';
import { FirestoreConnection } from '../cloud/FirestoreConnection';
import { Config } from '../Config';
import { DateUtils } from '../../utils/DateUtils';
import { CollectionReference, DocumentData } from '@google-cloud/firestore';

export class ConfigDAO {
	private _objectStore: ObjectStore;
	private _configCollection: CollectionReference;

	constructor(companyName: string) {
		this._objectStore = new FirestoreConnection();
		this._configCollection = this._objectStore.getCollection([
			'companies',
			companyName,
			'config',
		]);
	}

	/**
	 * Pega a última configuração disponível
	 */
	public getLastConfig(): Promise<void | Config> {
		return this._objectStore
			.getAllDocumentsFrom(this._configCollection)
			.then((documents) => {
				let lastDocument: DocumentData;
				documents.forEach((doc, index) => {
					if (index === 0) lastDocument = doc;
					if (doc.version > lastDocument.version) lastDocument = doc;
				});
				return new Config(lastDocument);
			})
			.catch((err) => console.log(err));
	}

	/**
	 * Adiciona uma configuração ao Banco de Dados
	 * @param jsonConfig Configuração a ser adicionada
	 */
	public addConfig(jsonConfig: { [key: string]: any }): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getLastConfig()
				.then((lastConfig: Config) => {
					if (!lastConfig) {
						jsonConfig['version'] = 1;
					} else {
						jsonConfig['version'] = lastConfig.version + 1;
					}
					jsonConfig['insertTime'] = DateUtils.generateDateString(
						true
					);
					const newConfig = new Config(jsonConfig);
					if (newConfig.validateConfig()) {
						resolve(
							this._objectStore.addDocumentIn(
								this._configCollection,
								jsonConfig
							)
						);
					} else {
						reject('Configuração inválida');
					}
				})
				.catch((err: { [key: string]: any }) => reject(err));
		});
	}
}
