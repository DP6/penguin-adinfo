import { ObjectStore } from '../DAO/ObjectStore';
import { FirestoreConnection } from '../cloud/FirestoreConnection';
import { Config } from '../Config';
import { DateUtils } from '../../utils/DateUtils';
import {
	CollectionReference,
	DocumentData,
	DocumentReference,
} from '@google-cloud/firestore';

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
	 * @param config Configuração a ser adicionada
	 */
	public addConfig(config: Config): Promise<DocumentReference> {
		return new Promise((resolve, reject) => {
			this.getLastConfig()
				.then((lastConfig: Config) => {
					if (!lastConfig) {
						config.version = 1;
					} else {
						config.version = lastConfig.version + 1;
					}
					config.insertTime = DateUtils.generateDateString(true);
					if (config.validateConfig()) {
						resolve(
							this._objectStore.addDocumentIn(
								this._configCollection,
								config.toJson(),
								`config_${config.version}`
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
