'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.StorageConnectionSingleton = void 0;
const storage_1 = require('@google-cloud/storage');
const FileStore_1 = require('../DAO/FileStore');
class StorageConnectionSingleton extends FileStore_1.FileStore {
	constructor() {
		super();
		this._bucket = `adinfo-dp6-files`;
		if (process.env.DEVELOPMENT) {
			const credentials = require('../../../gcp_key.json');
			this._db = new storage_1.Storage({ projectId: 'adinfo', credentials });
		} else {
			this._db = new storage_1.Storage();
		}
	}
	static getInstance() {
		if (!StorageConnectionSingleton._instance) {
			StorageConnectionSingleton._instance = new StorageConnectionSingleton();
		}
		return StorageConnectionSingleton._instance;
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
		return this._db.bucket(this._bucket).getFiles({ prefix: folder });
	}
}
exports.StorageConnectionSingleton = StorageConnectionSingleton;
