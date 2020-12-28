'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ConfigDAO = void 0;
const FirestoreConnection_1 = require('../cloud/FirestoreConnection');
const Config_1 = require('../Config');
const DateUtils_1 = require('../../utils/DateUtils');
class ConfigDAO {
	constructor(companyName) {
		this._objectStore = new FirestoreConnection_1.FirestoreConnection();
		this._configCollection = this._objectStore.getCollection([
			'companies',
			companyName,
			'config',
		]);
	}
	getLastConfig() {
		return this._objectStore
			.getAllDocumentsFrom(this._configCollection)
			.then((documents) => {
				let lastDocument;
				documents.forEach((doc, index) => {
					if (index === 0) lastDocument = doc;
					if (doc.version > lastDocument.version) lastDocument = doc;
				});
				return new Config_1.Config(lastDocument);
			})
			.catch((err) => console.log(err));
	}
	addConfig(jsonConfig) {
		return new Promise((resolve, reject) => {
			this.getLastConfig()
				.then((lastConfig) => {
					if (!lastConfig) {
						jsonConfig['version'] = 1;
					} else {
						jsonConfig['version'] = lastConfig.version + 1;
					}
					jsonConfig[
						'insertTime'
					] = DateUtils_1.DateUtils.generateDateString(true);
					const newConfig = new Config_1.Config(jsonConfig);
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
				.catch((err) => reject(err));
		});
	}
}
exports.ConfigDAO = ConfigDAO;
