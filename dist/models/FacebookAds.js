'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FacebookAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Vehicle_1 = require('./Vehicle');
class FacebookAds extends Vehicle_1.Vehicle {
	constructor(csvLine, config) {
		super(csvLine, config);
		this._facebookParams = {};
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetros incorretos: ';
		this._errorFacebookParams = {};
		this._undefinedParameterErrorMessage = 'Parâmetro(s) não encontrado(s) na configuração: ';
		this._undefinedParameterErrorFields = {};
		this._buildUrlParams();
		this._clearFacebookParamsNames();
	}
	buildedLine() {
		return this._facebookParams;
	}
	_buildUrlParams() {
		if (!this.config.medias.facebookads.dynamicValues) {
			const facebookadsConfig = Object.assign({}, this.config.medias.facebookads);
			Object.keys(facebookadsConfig).forEach((facebookParam) => {
				if (!this._isCompoundParameter(facebookParam)) {
					const columnFields = [];
					this._errorFacebookParams[facebookParam] = [];
					this._undefinedParameterErrorFields[facebookParam] = [];
					facebookadsConfig[facebookParam].forEach((column) => {
						if (!this.config.validationRules[column]) {
							this._hasUndefinedParameterError = true;
							this._undefinedParameterErrorFields[facebookParam].push(column);
							this._facebookParams[facebookParam] = '';
						} else {
							const normalizedColumn = StringUtils_1.StringUtils.normalize(column);
							if (!this.config.validateField(this.csvLine, column, this.csvLine[normalizedColumn])) {
								this._hasValidationError = true;
								this._errorFacebookParams[facebookParam].push(column);
							} else {
								columnFields.push(
									StringUtils_1.StringUtils.replaceWhiteSpace(
										this.csvLine[normalizedColumn],
										this.config.spaceSeparator
									).toLocaleLowerCase()
								);
							}
						}
						if (this._errorFacebookParams[facebookParam].length > 0) {
							this._facebookParams[facebookParam] =
								this._validationErrorMessage + this._errorFacebookParams[facebookParam].join(' - ');
						} else if (this._undefinedParameterErrorFields[facebookParam].length > 0) {
							this._facebookParams[facebookParam] =
								this._undefinedParameterErrorMessage + this._undefinedParameterErrorFields[facebookParam].join(' = ');
						} else {
							this._facebookParams[facebookParam] = columnFields.join(this.config.separator);
						}
					});
				}
			});
		}
	}
	_clearFacebookParamsNames() {
		const newParams = {};
		Object.keys(this._facebookParams).forEach((param) => {
			const newParam = param.replace(/\{|\}/g, '').replace('.', ' ');
			newParams[newParam] = this._facebookParams[param];
		});
		this._facebookParams = newParams;
	}
	_isCompoundParameter(parameter) {
		return /\}\}(.)\{\{/.test(parameter);
	}
	_clearFacebookParamName(parameter) {
		return parameter.replace(/\{|\}/g, '').replace('.', ' ');
	}
}
exports.FacebookAds = FacebookAds;
