'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GoogleAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const JsonUtils_1 = require('../utils/JsonUtils');
class GoogleAds {
	constructor(params, config, separators, validationRules, configTool) {
		this._adsParams = {};
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
		this._errorAdsParams = {};
		this._undefinedParameterErrorMessage =
			'Parâmetro(s) não encontrado(s) na configuração: ';
		this._undefinedParameterErrorFields = {};
		this._params = params;
		this._config = config;
		this._validationRules = validationRules;
		this._configTool = configTool;
		this._separator = separators.separator;
		this._spaceSeparator = separators.spaceSeparator;
		this._buildAdsParams();
	}
	get buildedLine() {
		return JsonUtils_1.JsonUtils.addParametersAt(this._adsParams, {
			'url google ads': 'auto tagging',
		});
	}
	_buildAdsParams() {
		Object.keys(this._config).forEach((googleAdsParam) => {
			this._adsParams[googleAdsParam] = '';
			this._errorAdsParams[googleAdsParam] = [];
			this._undefinedParameterErrorFields[googleAdsParam] = [];
			const utm = this._config[googleAdsParam];
			if (!this._configTool[utm]) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErrorFields[googleAdsParam].push(utm);
			} else {
				this._configTool[utm].forEach((column) => {
					if (
						StringUtils_1.StringUtils.validateString(
							this._params[column],
							this._validationRules[column]
						)
					) {
						this._adsParams[
							googleAdsParam
						] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
							this._params[column],
							this._spaceSeparator
						).toLowerCase()}${this._separator}`;
					} else {
						this._hasValidationError = true;
						this._errorAdsParams[googleAdsParam].push(column);
					}
				});
			}
			if (this._hasValidationError) {
				this._adsParams[googleAdsParam] =
					this._validationErrorMessage +
					this._errorAdsParams[googleAdsParam].join(', ');
			} else if (this._hasUndefinedParameterError) {
				this._adsParams[googleAdsParam] =
					this._undefinedParameterErrorMessage +
					this._undefinedParameterErrorFields[googleAdsParam].join(
						', '
					);
			} else {
				this._adsParams[googleAdsParam] = this._adsParams[
					googleAdsParam
				].slice(0, -1);
			}
		});
	}
}
exports.GoogleAds = GoogleAds;
