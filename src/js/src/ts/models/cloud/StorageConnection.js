'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.StorageConnection = void 0;
const storage_1 = require('@google-cloud/storage');
const credentials = require('../../../../config/gcp_key.json');
const FileStore_1 = require('../DAO/FileStore');
class StorageConnection extends FileStore_1.FileStore {
	constructor() {
		super();
		this._bucket = `adinfo-dp6-files`;
		this._db = new storage_1.Storage({ credentials });
	}
	saveFile(file, path) {
		const destinationBucket = this._db.bucket(this._bucket);
		const destinationPath = destinationBucket.file(path);
		return destinationPath.save(file.file);
	}
	getFile(filePath) {
		const destinationPath = this._db.bucket(this._bucket).file(filePath);
		return destinationPath.download();
	}
	getAllFiles(folder) {
		return this._db.bucket(this._bucket).getFiles({ prefix: `${folder}/` });
	}
}
exports.StorageConnection = StorageConnection;
