'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AnalyticsTool = void 0;
const JsonUtils_1 = require('../utils/JsonUtils');
class AnalyticsTool {
	constructor(csvLine, config, separators, validationRules) {
		this._csvLine = JsonUtils_1.JsonUtils.normalizeKeys(csvLine);
		this._config = config;
		this._separator = separators.separator;
		this._spaceSeparator = separators.spaceSeparator;
		this._validationRules = JsonUtils_1.JsonUtils.normalizeKeys(
			validationRules
		);
	}
	get csvLine() {
		return this._csvLine;
	}
	get config() {
		return this._config;
	}
	get separator() {
		return this._separator;
	}
	get spaceSeparator() {
		return this._spaceSeparator;
	}
	get validationRules() {
		return this._validationRules;
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
exports.AnalyticsTool = AnalyticsTool;
