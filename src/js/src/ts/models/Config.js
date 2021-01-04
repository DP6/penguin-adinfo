'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Config = void 0;
const JsonUtils_1 = require('../utils/JsonUtils');
class Config {
	constructor(jsonConfig) {
		this._separator = jsonConfig.separator;
		delete jsonConfig.separator;
		this._spaceSeparator = jsonConfig.spaceSeparator;
		delete jsonConfig.spaceSeparator;
		this._insertTime = jsonConfig.insertTime;
		delete jsonConfig.insertTime;
		this._version = jsonConfig.version;
		delete jsonConfig.version;
		this._analyticsTool = jsonConfig.ga || jsonConfig.adobe;
		delete jsonConfig.ga;
		delete jsonConfig.adobe;
		this._medias = jsonConfig;
	}
	validateConfig() {
		return !(
			!this._separator ||
			!this._spaceSeparator ||
			!this._insertTime ||
			!this._version ||
			!this._analyticsTool
		);
	}
	toString() {
		let jsonConfig = {};
		Object.keys(this).forEach((key, index) => {
			if (key === '_analyticsTool' || key === '_medias') {
				jsonConfig = JsonUtils_1.JsonUtils.addParametersAt(
					jsonConfig,
					Object.values(this)[index] || {}
				);
			} else {
				jsonConfig[key.replace('_', '')] = Object.values(this)[index];
			}
		});
		return JSON.stringify(jsonConfig);
	}
	toJson() {
		let jsonConfig = {};
		Object.keys(this).forEach((key, index) => {
			if (key === '_analyticsTool' || key === '_medias') {
				jsonConfig = JsonUtils_1.JsonUtils.addParametersAt(
					jsonConfig,
					Object.values(this)[index]
				);
			} else {
				jsonConfig[key.replace('_', '')] = Object.values(this)[index];
			}
		});
		return jsonConfig;
	}
	get separator() {
		return this._separator;
	}
	get spaceSeparator() {
		return this._spaceSeparator;
	}
	get insertTime() {
		return this._insertTime;
	}
	set insertTime(insertTime) {
		this._insertTime = insertTime;
	}
	get version() {
		return this._version;
	}
	set version(version) {
		this._version = version;
	}
	get analyticsTool() {
		return this._analyticsTool;
	}
	get medias() {
		return this._medias;
	}
}
exports.Config = Config;
