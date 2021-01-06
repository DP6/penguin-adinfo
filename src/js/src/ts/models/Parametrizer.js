'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Parametrizer = void 0;
const JsonUtils_1 = require('../utils/JsonUtils');
class Parametrizer {
	constructor(csvLine, config) {
		this._csvLine = JsonUtils_1.JsonUtils.normalizeKeys(csvLine);
		this._config = config;
	}
	get csvLine() {
		return this._csvLine;
	}
	get config() {
		return this._config;
	}
	get url() {
		return this._url;
	}
	set url(url) {
		this._url = url;
	}
	_isEmpty(parameter) {
		return !parameter;
	}
}
exports.Parametrizer = Parametrizer;
