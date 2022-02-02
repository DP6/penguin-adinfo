'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GA = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const AnalyticsTool_1 = require('./AnalyticsTool');
const StringEmptyHandler_1 = require('../Handlers/StringEmptyHandler');
const ValidateFieldHandler_1 = require('../Handlers/ValidateFieldHandler');
const ValidateFieldDependencyHandler_1 = require('../Handlers/ValidateFieldDependencyHandler');
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
			this._undefinedParameterErroMessage[utm] = 'Parâmetros não encontrados:';
		});
		this._utms = this._buildUtms();
		this.url = this._buildUrl();
	}
	_hasErrorAtUtm(utm) {
		return this._hasUndefinedParameterError[utm] || this._hasValidationError[utm];
	}
	_errorMessageAtUtm(utm) {
		const errorMessages = [];
		if (this._hasUndefinedParameterError[utm]) {
			errorMessages.push(this._undefinedParameterErroMessage[utm].slice(0, -2));
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
		const utmReturn = {};
		let hasError = false;
		Object.keys(this._utms).forEach((utm) => {
			utmReturn[utm] = this._hasErrorAtUtm(utm) ? this._errorMessageAtUtm(utm) : this._utms[utm];
			hasError = !hasError && this._hasErrorAtUtm(utm) ? true : hasError;
		});
		return {
			values: Object.assign(Object.assign({}, utmReturn), {
				'url ga': this._hasAnyErrorAtUtms() ? 'Corrija os parâmetros para gerar a URL' : this.url,
			}),
			hasError: hasError,
		};
	}
	_buildUtms() {
		const utms = {};
		Object.keys(this.config.analyticsTool.ga).forEach((utm) => {
			let utmString = '';
			this.config.analyticsTool.ga[utm].forEach((column) => {
				const columnNormalized = StringUtils_1.StringUtils.normalize(column);
				const stringEmptyHandler = new StringEmptyHandler_1.StringEmptyHandler();
				const validateFieldHandler = new ValidateFieldHandler_1.ValidateFieldHandler(this.config, column);
				const validateFieldDependencyHandler = new ValidateFieldDependencyHandler_1.ValidateFieldDependencyHandler(
					this.config,
					this.csvLine,
					column
				);
				stringEmptyHandler.setNext(validateFieldHandler).setNext(validateFieldDependencyHandler);
				try {
					stringEmptyHandler.handle(this.csvLine[columnNormalized]);
				} catch (e) {
					if (e.name === 'StringEmptyError') {
						this._hasUndefinedParameterError[utm] = true;
						this._undefinedParameterErroMessage[utm] += ` ${column} -`;
					} else {
						this._hasValidationError[utm] = true;
						this._validationErrorMessage[utm] += ` ${column} -`;
					}
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
		const ancora = this.csvLine.url.match(/#.*/);
		const newUrl = this.csvLine.url.replace(`${ancora}`, '');
		const regex = /\?/;
		if (regex.test(newUrl)) return `${newUrl}&${utmString.slice(0, -1)}${ancora == null ? '' : ancora}`;
		return `${newUrl}?${utmString.slice(0, -1)}${ancora == null ? '' : ancora}`;
	}
}
exports.GA = GA;
