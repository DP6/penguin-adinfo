'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FacebookAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Vehicle_1 = require('./Vehicle');
const ValidateRulesForColumnHandler_1 = require('../Handlers/ValidateRulesForColumnHandler');
const ValidateFieldHandler_1 = require('../Handlers/ValidateFieldHandler');
const ValidateFieldDependecyHandler_1 = require('../Handlers/ValidateFieldDependecyHandler');
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
						const columnNormalized = StringUtils_1.StringUtils.normalize(column);
						const validateRulesForColumnHandler = new ValidateRulesForColumnHandler_1.ValidateRulesForColumnHandler(
							this.config,
							column
						);
						const validateFieldHandler = new ValidateFieldHandler_1.ValidateFieldHandler(this.config, column);
						const validateFieldDependecyHandler = new ValidateFieldDependecyHandler_1.ValidateFieldDependecyHandler(
							this.config,
							this.csvLine,
							column
						);
						validateRulesForColumnHandler.setNext(validateFieldHandler).setNext(validateFieldDependecyHandler);
						try {
							validateRulesForColumnHandler.handle(this.csvLine[columnNormalized]);
							columnFields.push(
								StringUtils_1.StringUtils.replaceWhiteSpace(
									this.csvLine[columnNormalized],
									this.config.spaceSeparator
								).toLocaleLowerCase()
							);
						} catch (e) {
							if (e.name === 'ValidateRulesForColumnError') {
								this._hasUndefinedParameterError = true;
								this._undefinedParameterErrorFields[facebookParam].push(column);
								this._facebookParams[facebookParam] = '';
							} else if (e.name === 'ValidateFieldError' || e.name === 'ValidateFieldDependecyError') {
								this._hasValidationError = true;
								this._errorFacebookParams[facebookParam].push(column);
							}
						}
						if (this._undefinedParameterErrorFields[facebookParam].length > 0) {
							this._facebookParams[facebookParam] =
								this._undefinedParameterErrorMessage + this._undefinedParameterErrorFields[facebookParam].join(' = ');
						} else if (this._errorFacebookParams[facebookParam].length > 0) {
							this._facebookParams[facebookParam] =
								this._validationErrorMessage + this._errorFacebookParams[facebookParam].join(' - ');
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
