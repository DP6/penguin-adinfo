'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GoogleAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Vehicle_1 = require('./Vehicle');
class GoogleAds extends Vehicle_1.Vehicle {
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
		this._buildAdsParams();
	}
	buildedLine() {
		return this._adsParams;
	}
	_buildAdsParams() {
		Object.keys(this.config.medias.googleads).forEach((googleAdsParam) => {
			this._adsParams[googleAdsParam] = '';
			this._errorAdsParams[googleAdsParam] = [];
			this._undefinedParameterErrorFields[googleAdsParam] = [];
			const fields = this.config.medias.googleads[googleAdsParam];
			fields.forEach((column) => {
				if (!this.config.validationRules[column]) {
					this._hasUndefinedParameterError = true;
					this._undefinedParameterErrorFields[googleAdsParam].push(
						column
					);
				} else {
					const normalizedColumn = StringUtils_1.StringUtils.normalize(
						column
					);
					if (
						this.config.validationRules[column].length > 0 &&
						!StringUtils_1.StringUtils.validateString(
							this.csvLine[normalizedColumn],
							this.config.validationRules[column]
						)
					) {
						this._hasValidationError = true;
						this._errorAdsParams[googleAdsParam].push(column);
					} else {
						this._adsParams[
							googleAdsParam
						] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.config.spaceSeparator
						).toLowerCase()}${this.config.separator}`;
					}
				}
			});
			if (this._hasValidationError) {
				this._adsParams[googleAdsParam] =
					this._validationErrorMessage +
					this._errorAdsParams[googleAdsParam].join(' - ');
			} else if (this._hasUndefinedParameterError) {
				this._adsParams[googleAdsParam] =
					this._undefinedParameterErrorMessage +
					this._undefinedParameterErrorFields[googleAdsParam].join(
						' - '
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
