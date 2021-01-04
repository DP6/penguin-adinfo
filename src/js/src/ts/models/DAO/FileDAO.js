'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FileDAO = void 0;
const StorageConnection_1 = require('../cloud/StorageConnection');
class FileDAO {
	constructor() {
		this._fileStore = new StorageConnection_1.StorageConnection();
	}
	get file() {
		return this._file;
	}
	set file(file) {
		this._file = file;
	}
	save(path) {
		return this._fileStore.saveFile(this, path);
	}
	getFromStore(filePath) {
		return this._fileStore.getFile(filePath);
	}
	getAllFilesFromStore(agency) {
		return this._fileStore.getAllFiles(agency);
	}
}
exports.FileDAO = FileDAO;
