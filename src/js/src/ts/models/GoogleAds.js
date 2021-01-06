'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GoogleAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const JsonUtils_1 = require('../utils/JsonUtils');
const Parametrizer_1 = require('./Parametrizer');
class GoogleAds extends Parametrizer_1.Parametrizer {
	constructor(csvLine, config) {
		super(csvLine, config);
		this._adsParams = {};
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
		this._errorAdsParams = {};
		this._undefinedParameterErrorMessage =
			'Parâmetro(s) não encontrado(s) na configuração: ';
		this._undefinedParameterErrorFields = {};
		this._configAnalyticsTool = this._buildConfigAnalyticsTool();
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
	_buildConfigAnalyticsTool() {
		const type = this.config.analyticsToolName;
		const configAnalyticsTool = {};
		Object.keys(this.config.analyticsTool[type]).forEach((param) => {
			configAnalyticsTool[param] = Object.keys(
				this.config.analyticsTool[type][param]
			);
		});
		return configAnalyticsTool;
	}
	_buildAdsParams() {
		Object.keys(this.config.medias.googleads).forEach((googleAdsParam) => {
			this._adsParams[googleAdsParam] = '';
			this._errorAdsParams[googleAdsParam] = [];
			this._undefinedParameterErrorFields[googleAdsParam] = [];
			const utm = this.config.medias.googleads[googleAdsParam];
			if (!this._configAnalyticsTool[utm]) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErrorFields[googleAdsParam].push(utm);
			} else {
				this._configAnalyticsTool[utm].forEach((column) => {
					const normalizedColumn = StringUtils_1.StringUtils.normalize(
						column
					);
					if (
						StringUtils_1.StringUtils.validateString(
							this.csvLine[normalizedColumn],
							this.config.validationRules[column]
						)
					) {
						this._adsParams[
							googleAdsParam
						] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.config.spaceSeparator
						).toLowerCase()}${this.config.separator}`;
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
