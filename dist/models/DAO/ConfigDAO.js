'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ConfigDAO = void 0;
const FirestoreConnectionSingleton_1 = require('../cloud/FirestoreConnectionSingleton');
const Config_1 = require('../Config');
const DateUtils_1 = require('../../utils/DateUtils');
class ConfigDAO {
	constructor(companyName) {
		this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
		this._configCollection = this._objectStore.getCollection(['companies', companyName, 'config']);
	}
	getLastConfig() {
		return this._objectStore
			.getAllDocumentsFrom(this._configCollection)
			.then((documents) => {
				if (documents.length === 0) {
					throw new Error('A empresa não possui nenhuma configuração!');
				}
				let lastDocument;
				documents.forEach((doc, index) => {
					if (index === 0) lastDocument = doc;
					if (doc.version > lastDocument.version) lastDocument = doc;
				});
				return new Config_1.Config(lastDocument);
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}
	addConfig(config) {
		return new Promise((resolve, reject) => {
			this.getLastConfig()
				.then((lastConfig) => {
					if (!lastConfig.version) {
						config.version = 1;
					} else {
						config.version = lastConfig.version + 1;
					}
					config.insertTime = DateUtils_1.DateUtils.generateDateString(true);
					if (config.validateConfig()) {
						resolve(
							this._objectStore.addDocumentIn(this._configCollection, config.toJson(), `config_${config.version}`)
						);
					} else {
						throw new Error('Configuração inválida!');
					}
				})
				.catch((err) => reject(err));
		});
	}
}
exports.ConfigDAO = ConfigDAO;
