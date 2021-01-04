'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FacebookAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const JsonUtils_1 = require('../utils/JsonUtils');
const Parametrizer_1 = require('./Parametrizer');
class FacebookAds extends Parametrizer_1.Parametrizer {
	constructor(csvLine, config, separators, validationRules, configTool) {
		super(csvLine, separators, validationRules);
		this._facebookParams = {};
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetros incorretos: ';
		this._errorFacebookParams = {};
		this._undefinedParameterErrorMessage =
			'Parâmetro(s) não encontrado(s) na configuração: ';
		this._undefinedParameterErrorFields = {};
		this._dynamicValues =
			config['dynamicValues'].toLowerCase() === 'true' ? true : false;
		this._config = Object.assign({}, config);
		delete this._config['dynamicValues'];
		this._configTool = configTool;
		this._buildUrlParams();
		this.buildUrl();
		this._clearFacebookParamsNames();
	}
	buildedLine() {
		return JsonUtils_1.JsonUtils.addParametersAt(this._facebookParams, {
			'url facebook': this.url,
		});
	}
	_buildUrlParams() {
		if (this._dynamicValues) {
			Object.keys(this._config).forEach((urlParam) => {
				const facebookParam = this._config[urlParam];
				if (!this._isCompoundParameter(urlParam)) {
					const urlParamFields = [];
					this._errorFacebookParams[facebookParam] = [];
					this._undefinedParameterErrorFields[facebookParam] = [];
					if (!this._configTool[urlParam]) {
						this._hasUndefinedParameterError = true;
						this._undefinedParameterErrorFields[facebookParam].push(
							urlParam
						);
						this._facebookParams[facebookParam] = '';
					} else {
						this._configTool[urlParam].forEach((column) => {
							const normalizedColumn = StringUtils_1.StringUtils.normalize(
								column
							);
							if (
								StringUtils_1.StringUtils.validateString(
									this.csvLine[normalizedColumn],
									this.validationRules[normalizedColumn]
								)
							) {
								urlParamFields.push(
									StringUtils_1.StringUtils.replaceWhiteSpace(
										this.csvLine[normalizedColumn],
										this.spaceSeparator
									).toLocaleLowerCase()
								);
							} else {
								this._hasValidationError = true;
								this._errorFacebookParams[facebookParam].push(
									column
								);
							}
						});
					}
					if (this._errorFacebookParams[facebookParam].length > 0) {
						this._facebookParams[facebookParam] =
							this._validationErrorMessage +
							this._errorFacebookParams[facebookParam].join(', ');
					} else if (
						this._undefinedParameterErrorFields[facebookParam]
							.length > 0
					) {
						this._facebookParams[facebookParam] =
							this._undefinedParameterErrorMessage +
							this._undefinedParameterErrorFields[
								facebookParam
							].join(', ');
					} else {
						this._facebookParams[
							facebookParam
						] = urlParamFields.join(this.separator);
					}
				}
			});
		}
	}
	buildUrl() {
		if (this._hasValidationError) {
			const errorFields = Object.keys(this._errorFacebookParams).filter(
				(facebookParam) =>
					this._errorFacebookParams[facebookParam].length > 0
			);
			this.url =
				'Para gerar a URL corrija o(s) parâmetro(s): ' +
				this._clearFacebookParamName(errorFields.join(', '));
		} else if (this._hasUndefinedParameterError) {
			const errorFields = Object.keys(
				this._undefinedParameterErrorFields
			).filter(
				(facebookParam) =>
					this._undefinedParameterErrorFields[facebookParam].length >
					0
			);
			this.url =
				'Para gerar a URL corrija o(s) parâmetro(s): ' +
				this._clearFacebookParamName(errorFields.join(', '));
		} else {
			this.url = `${this.csvLine.url}?`;
			const urlParams = [];
			Object.keys(this._config).forEach((config) => {
				urlParams.push(`${config}=${this._config[config]}`);
			});
			this.url = this.url + urlParams.join('&');
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
