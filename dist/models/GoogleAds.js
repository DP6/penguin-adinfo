'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GoogleAds = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Vehicle_1 = require('./Vehicle');
class GoogleAds extends Vehicle_1.Vehicle {
	constructor(csvLine, config) {
		super(csvLine, config);
		this._adsParams = {};
		this._hasValidationError = {};
		this._hasUndefinedParameterError = {};
		this._validationErrorMessage = {};
		this._undefinedParameterErrorMessage = {};
		this._errorAdsParams = {};
		this._undefinedParameterErrorFields = {};
		Object.keys(this.config.medias.googleads).map((adsParam) => {
			this._hasValidationError[adsParam] = false;
			this._hasUndefinedParameterError[adsParam] = false;
			this._validationErrorMessage[adsParam] = 'Parâmetro(s) incorreto(s): ';
			this._undefinedParameterErrorMessage[adsParam] = 'Parâmetro(s) não encontrado(s): ';
		});
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
					this._hasUndefinedParameterError[googleAdsParam] = true;
					this._undefinedParameterErrorFields[googleAdsParam].push(column);
				} else {
					const normalizedColumn = StringUtils_1.StringUtils.normalize(column);
					if (!this.config.validateField(this.csvLine, column, this.csvLine[normalizedColumn])) {
						this._hasValidationError[googleAdsParam] = true;
						this._errorAdsParams[googleAdsParam].push(column);
					} else {
						this._adsParams[googleAdsParam] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.config.spaceSeparator
						).toLowerCase()}${this.config.separator}`;
					}
				}
			});
			if (this._hasValidationError[googleAdsParam]) {
				this._adsParams[googleAdsParam] =
					this._validationErrorMessage[googleAdsParam] + this._errorAdsParams[googleAdsParam].join(' - ');
			} else if (this._hasUndefinedParameterError[googleAdsParam]) {
				this._adsParams[googleAdsParam] =
					this._undefinedParameterErrorMessage[googleAdsParam] +
					this._undefinedParameterErrorFields[googleAdsParam].join(' - ');
			} else {
				this._adsParams[googleAdsParam] = this._adsParams[googleAdsParam].slice(0, -1);
			}
		});
	}
}
exports.GoogleAds = GoogleAds;
