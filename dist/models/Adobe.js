'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Adobe = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const AnalyticsTool_1 = require('./AnalyticsTool');
class Adobe extends AnalyticsTool_1.AnalyticsTool {
	constructor(csvLine, config) {
		super(csvLine, config);
		this._cid = '';
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._validationErrorMessage = 'Parâmetros incorretos:';
		this._undefinedParameterErroMessage = 'Parâmetros não encontrados:';
		this._cid = this._buildCid();
		this.url = this._buildUrl();
	}
	_hasErrorAtCid() {
		return this._hasValidationError || this._hasUndefinedParameterError;
	}
	_errorMessage() {
		const errorMessages = [];
		if (this._hasUndefinedParameterError) {
			errorMessages.push(this._undefinedParameterErroMessage.slice(0, -2));
		}
		if (this._hasValidationError) {
			errorMessages.push(this._validationErrorMessage.slice(0, -2));
		}
		return errorMessages.join(' - ');
	}
	buildedLine() {
		return {
			cid: this._hasErrorAtCid() ? this._errorMessage() : this._cid,
			'url adobe': this._hasErrorAtCid() ? 'Corrija os parâmetros para gerar a URL' : this.url,
		};
	}
	_buildCid() {
		let cid = '';
		this.config.analyticsTool.adobe.cid.forEach((column) => {
			const columnNormalized = StringUtils_1.StringUtils.normalize(column);
			if (StringUtils_1.StringUtils.isEmpty(this.csvLine[columnNormalized])) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErroMessage += ` ${column} -`;
				return;
			}
			if (!this.config.validateField(this.csvLine, column, this.csvLine[columnNormalized])) {
				this._hasValidationError = true;
				this._validationErrorMessage += ` ${column} -`;
			}
			cid += `${this.csvLine[columnNormalized]}${this.config.separator}`;
		});
		cid = StringUtils_1.StringUtils.replaceWhiteSpace(
			StringUtils_1.StringUtils.normalize(cid),
			this.config.spaceSeparator
		).slice(0, -1);
		return cid;
	}
	_buildUrl() {
		return `${this.csvLine.url}?cid=${this._cid}`;
	}
}
exports.Adobe = Adobe;
