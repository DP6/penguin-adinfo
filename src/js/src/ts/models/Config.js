'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Config = void 0;
const JsonUtils_1 = require('../utils/JsonUtils');
class Config {
	constructor(jsonConfig) {
		this._csvSeparator = ',';
		this._separator = jsonConfig.separator;
		delete jsonConfig.separator;
		this._csvSeparator = jsonConfig.csvSeparator;
		delete jsonConfig.csvSeparator;
		this._spaceSeparator = jsonConfig.spaceSeparator;
		delete jsonConfig.spaceSeparator;
		this._insertTime = jsonConfig.insertTime;
		delete jsonConfig.insertTime;
		this._version = jsonConfig.version;
		delete jsonConfig.version;
		if (jsonConfig.ga) {
			this._analyticsTool = { ga: jsonConfig.ga };
			this._analyticsToolName = 'ga';
			delete jsonConfig.ga;
		} else if (jsonConfig.adobe) {
			this._analyticsTool = { adobe: jsonConfig.adobe };
			this._analyticsToolName = 'adobe';
			delete jsonConfig.adobe;
		}
		this._medias = jsonConfig;
		this._validationRules = this._getValidationRules();
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
			} else if (
				key !== '_validationRules' &&
				key !== '_analyticsToolName'
			) {
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
			} else if (
				key !== '_validationRules' &&
				key !== '_analyticsToolName'
			) {
				jsonConfig[key.replace('_', '')] = Object.values(this)[index];
			}
		});
		return jsonConfig;
	}
	toCsvTemplate() {
		const configValues = [];
		configValues.push('Url');
		const vehicle = Object.keys(this._analyticsTool)[0];
		Object.keys(this._analyticsTool[vehicle]).map((campaignParam) => {
			Object.keys(this._analyticsTool[vehicle][campaignParam]).map(
				(param) => {
					if (configValues.indexOf(param) === -1)
						configValues.push(param);
				}
			);
		});
		return configValues.join(this._csvSeparator);
	}
	_getValidationRules() {
		const type = this._analyticsToolName;
		const validationRules = {};
		Object.keys(this._analyticsTool[type]).map((field) => {
			Object.keys(this._analyticsTool[type][field]).map((column) => {
				validationRules[column] = this._analyticsTool[type][field][
					column
				];
			});
		});
		return validationRules;
	}
	get validationRules() {
		return this._validationRules;
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
	get analyticsToolName() {
		return this._analyticsToolName;
	}
	get csvSeparator() {
		return this._csvSeparator;
	}
}
exports.Config = Config;
