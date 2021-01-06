'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Adobe = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Parametrizer_1 = require('./Parametrizer');
class Adobe extends Parametrizer_1.Parametrizer {
	constructor(csvLine, config, separators, validationRules) {
		super(csvLine, separators, validationRules);
		this._cid = '';
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetros incorretos:';
		this._undefinedParameterErroMessage = 'Parâmetros não encontrados:';
		this._config = config;
		this._buildCid();
		this.buildUrl();
	}
	_hasErrorAtCid() {
		return this._hasValidationError || this._hasUndefinedParameterError;
	}
	_errorMessage() {
		const errorMessages = [];
		if (this._hasUndefinedParameterError) {
			errorMessages.push(
				this._undefinedParameterErroMessage.slice(0, -1)
			);
		}
		if (this._hasValidationError) {
			errorMessages.push(this._validationErrorMessage.slice(0, -1));
		}
		return errorMessages.join(' - ');
	}
	buildedLine() {
		return {
			cid: this._hasErrorAtCid() ? this._errorMessage() : this._cid,
			'url adobe': this._hasErrorAtCid()
				? 'Corrija os parâmetros para gerar a URL'
				: this.url,
		};
	}
	_buildCid() {
		this._config.cid.forEach((column) => {
			const columnNormalized = StringUtils_1.StringUtils.normalize(
				column
			);
			if (this._isEmpty(this.csvLine[columnNormalized])) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErroMessage += ` ${column},`;
				return;
			}
			if (
				this.validationRules[columnNormalized] &&
				!StringUtils_1.StringUtils.validateString(
					this.csvLine[columnNormalized],
					this.validationRules[columnNormalized]
				)
			) {
				this._hasValidationError = true;
				this._validationErrorMessage += ` ${column},`;
			}
			this._cid += `${this.csvLine[columnNormalized]}${this.separator}`;
		});
		this._cid = StringUtils_1.StringUtils.replaceWhiteSpace(
			StringUtils_1.StringUtils.normalize(this._cid),
			this.spaceSeparator
		).slice(0, -1);
	}
	buildUrl() {
		this.url = `${this.csvLine.url}?cid=${this._cid}`;
	}
}
exports.Adobe = Adobe;
