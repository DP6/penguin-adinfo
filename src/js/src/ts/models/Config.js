'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Config = void 0;
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
		const jsonConfig = {};
		Object.keys(this).forEach((key, index) => {
			jsonConfig[key.replace('_', '')] = Object.values(this)[index];
		});
		return JSON.stringify(jsonConfig);
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
	get version() {
		return this._version;
	}
	get analyticsTool() {
		return this._analyticsTool;
	}
	get medias() {
		return this._medias;
	}
}
exports.Config = Config;
