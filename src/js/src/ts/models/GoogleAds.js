'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GoogleAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const JsonUtils_1 = require('../utils/JsonUtils');
const Parametrizer_1 = require('./Parametrizer');
class GoogleAds extends Parametrizer_1.Parametrizer {
	constructor(csvLine, config, separators, validationRules, configTool) {
		super(csvLine, separators, validationRules);
		this._adsParams = {};
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
		this._errorAdsParams = {};
		this._undefinedParameterErrorMessage =
			'Parâmetro(s) não encontrado(s) na configuração: ';
		this._undefinedParameterErrorFields = {};
		this._config = config;
		this._configTool = configTool;
		this._buildAdsParams();
	}
	buildUrl() {
		return {
			'url google ads': 'auto tagging',
		};
	}
	buildedLine() {
		return JsonUtils_1.JsonUtils.addParametersAt(
			this._adsParams,
			this.buildUrl()
		);
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
					const normalizedColumn = StringUtils_1.StringUtils.normalize(
						column
					);
					if (
						StringUtils_1.StringUtils.validateString(
							this.csvLine[normalizedColumn],
							this.validationRules[normalizedColumn]
						)
					) {
						this._adsParams[
							googleAdsParam
						] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.spaceSeparator
						).toLowerCase()}${this.separator}`;
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
