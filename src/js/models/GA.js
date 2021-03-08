'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GA = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const AnalyticsTool_1 = require('./AnalyticsTool');
class GA extends AnalyticsTool_1.AnalyticsTool {
	constructor(csvLine, config) {
		super(csvLine, config);
		this._utms = {};
		this._hasValidationError = {};
		this._hasUndefinedParameterError = {};
		this._validationErrorMessage = {};
		this._undefinedParameterErroMessage = {};
		Object.keys(this.config.analyticsTool.ga).map((utm) => {
			this._hasValidationError[utm] = false;
			this._hasUndefinedParameterError[utm] = false;
			this._validationErrorMessage[utm] = 'Parâmetros incorretos:';
			this._undefinedParameterErroMessage[utm] =
				'Parâmetros não encontrados:';
		});
		this._utms = this._buildUtms();
		this.url = this._buildUrl();
	}
	_hasErrorAtUtm(utm) {
		return (
			this._hasUndefinedParameterError[utm] ||
			this._hasValidationError[utm]
		);
	}
	_errorMessageAtUtm(utm) {
		const errorMessages = [];
		if (this._hasUndefinedParameterError[utm]) {
			errorMessages.push(
				this._undefinedParameterErroMessage[utm].slice(0, -2)
			);
		}
		if (this._hasValidationError[utm]) {
			errorMessages.push(this._validationErrorMessage[utm].slice(0, -2));
		}
		return errorMessages.join(' - ');
	}
	_hasAnyErrorAtUtms() {
		let hasError = false;
		Object.keys(this._utms).forEach((utm) => {
			if (this._hasErrorAtUtm(utm)) {
				hasError = true;
			}
		});
		return hasError;
	}
	buildedLine() {
		const utms = {};
		Object.keys(this._utms).map((utm) => {
			utms[utm] = this._hasErrorAtUtm(utm)
				? this._errorMessageAtUtm(utm)
				: this._utms[utm];
		});
		return {
			utms: utms,
			'url ga': this._hasAnyErrorAtUtms()
				? 'Corrija os parâmetros para gerar a URL'
				: this.url,
		};
	}
	_buildUtms() {
		const utms = {};
		Object.keys(this.config.analyticsTool.ga).forEach((utm) => {
			let utmString = '';
			this.config.analyticsTool.ga[utm].forEach((column) => {
				const columnNormalized = StringUtils_1.StringUtils.normalize(
					column
				);
				if (
					StringUtils_1.StringUtils.isEmpty(
						this.csvLine[columnNormalized]
					)
				) {
					this._hasUndefinedParameterError[utm] = true;
					this._undefinedParameterErroMessage[utm] += ` ${column} -`;
					return;
				}
				if (
					!this.config.validateField(
						this.csvLine,
						column,
						this.csvLine[columnNormalized]
					)
				) {
					this._hasValidationError[utm] = true;
					this._validationErrorMessage[utm] += ` ${column} -`;
				}
				utmString += `${this.csvLine[columnNormalized]}${this.config.separator}`;
			});
			utms[utm] = StringUtils_1.StringUtils.replaceWhiteSpace(
				StringUtils_1.StringUtils.normalize(utmString).slice(0, -1),
				this.config.spaceSeparator
			);
		});
		return utms;
	}
	_buildUrl() {
		let utmString = '';
		Object.keys(this._utms).forEach((utm) => {
			utmString += `${utm}=${this._utms[utm]}&`;
		});
		return `${this.csvLine.url}?${utmString.slice(0, -1)}`;
	}
}
exports.GA = GA;
