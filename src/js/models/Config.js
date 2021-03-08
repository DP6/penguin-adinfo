'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Config = void 0;
const JsonUtils_1 = require('../utils/JsonUtils');
const DependencyConfig_1 = require('./DependencyConfig');
const StringUtils_1 = require('../utils/StringUtils');
class Config {
	constructor(jsonConfig) {
		this._csvSeparator = ',';
		const jsonConfigTemp = Object.assign({}, jsonConfig);
		this._separator = jsonConfigTemp.separator;
		delete jsonConfigTemp.separator;
		if (jsonConfigTemp.csvSeparator) {
			this._csvSeparator = jsonConfigTemp.csvSeparator;
			delete jsonConfigTemp.csvSeparator;
		}
		this._dependenciesConfig = this._buildDependenciesConfig(
			jsonConfigTemp.dependenciesConfig
		);
		delete jsonConfigTemp.dependenciesConfig;
		this._spaceSeparator = jsonConfigTemp.spaceSeparator;
		delete jsonConfigTemp.spaceSeparator;
		this._insertTime = jsonConfigTemp.insertTime;
		delete jsonConfigTemp.insertTime;
		this._version = jsonConfigTemp.version;
		delete jsonConfigTemp.version;
		if (jsonConfigTemp.ga) {
			this._analyticsTool = { ga: jsonConfigTemp.ga };
			this._analyticsToolName = 'ga';
			delete jsonConfigTemp.ga;
		} else if (jsonConfigTemp.adobe) {
			this._analyticsTool = { adobe: jsonConfigTemp.adobe };
			this._analyticsToolName = 'adobe';
			delete jsonConfigTemp.adobe;
		}
		this._validationRules = jsonConfigTemp.columns;
		delete jsonConfigTemp.columns;
		this._medias = jsonConfigTemp;
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
	_buildDependenciesConfig(dependenciesConfig) {
		if (!dependenciesConfig) {
			return [];
		}
		return dependenciesConfig.map(
			(dependencyConfig) =>
				new DependencyConfig_1.DependencyConfig(dependencyConfig)
		);
	}
	toString() {
		return JSON.stringify(this.toJson());
	}
	toJson() {
		let jsonConfig = {};
		Object.keys(this).forEach((key, index) => {
			if (key === '_analyticsTool' || key === '_medias') {
				jsonConfig = JsonUtils_1.JsonUtils.addParametersAt(
					jsonConfig,
					Object.values(this)[index]
				);
			} else if (key === '_validationRules') {
				jsonConfig = JsonUtils_1.JsonUtils.addParametersAt(jsonConfig, {
					columns: this._validationRules,
				});
			} else if (key === '_dependenciesConfig') {
				if (this._dependenciesConfig.length > 0) {
					jsonConfig[
						'dependenciesConfig'
					] = this._dependenciesConfig.map((dependencyConfig) => {
						return dependencyConfig.toJson();
					});
				}
			} else if (
				key !== '_analyticsToolName' &&
				Object.values(this)[index]
			) {
				jsonConfig[key.replace('_', '')] = Object.values(this)[index];
			}
		});
		return jsonConfig;
	}
	toCsvTemplate() {
		const configValues = [];
		configValues.push('Url');
		Object.keys(this._validationRules).forEach((column) => {
			configValues.push(column);
		});
		return configValues.join(this._csvSeparator);
	}
	_existsValidationRuleFor(csvColumn) {
		return this.validationRules[csvColumn].length > 0;
	}
	_validateRulesFor(csvColumn, value) {
		if (!this._existsValidationRuleFor(csvColumn)) {
			return true;
		}
		return StringUtils_1.StringUtils.validateString(
			value,
			this._validationRules[csvColumn]
		);
	}
	_getDependencyConfigFor(csvColumn) {
		let dependencyColumnConfig;
		this._dependenciesConfig.forEach((dependencyConfig) => {
			if (dependencyConfig.columnDestiny === csvColumn) {
				dependencyColumnConfig = dependencyConfig;
			}
		});
		return dependencyColumnConfig;
	}
	_validateDependencyRulesFor(csvLine, csvColumn, value) {
		const dependencyConfigForCsvColumn = this._getDependencyConfigFor(
			csvColumn
		);
		if (
			!dependencyConfigForCsvColumn ||
			!StringUtils_1.StringUtils.validateString(
				csvLine[
					StringUtils_1.StringUtils.normalize(
						dependencyConfigForCsvColumn.columnReference
					)
				],
				dependencyConfigForCsvColumn.valuesReference
			)
		) {
			return true;
		}
		if (dependencyConfigForCsvColumn.hasMatch) {
			return StringUtils_1.StringUtils.validateString(
				value,
				dependencyConfigForCsvColumn.matches
			);
		} else {
			return !StringUtils_1.StringUtils.validateString(
				value,
				dependencyConfigForCsvColumn.matches
			);
		}
	}
	validateField(csvLine, csvColumn, value) {
		return (
			this._validateRulesFor(csvColumn, value) &&
			this._validateDependencyRulesFor(csvLine, csvColumn, value)
		);
	}
	existsColumn(csvColumn) {
		return !!this.validationRules[csvColumn];
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
