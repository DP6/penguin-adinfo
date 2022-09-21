"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adobe = void 0;
const StringUtils_1 = require("../utils/StringUtils");
const AnalyticsTool_1 = require("./AnalyticsTool");
const StringEmptyHandler_1 = require("../Handlers/StringEmptyHandler");
const ValidateFieldHandler_1 = require("../Handlers/ValidateFieldHandler");
const ValidateFieldDependencyHandler_1 = require("../Handlers/ValidateFieldDependencyHandler");
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
            values: {
                cid: this._hasErrorAtCid() ? this._errorMessage() : this._cid,
                'url adobe': this._hasErrorAtCid() ? 'Corrija os parâmetros para gerar a URL' : this.url,
            },
            hasError: this._hasErrorAtCid(),
        };
    }
    _buildCid() {
        let cid = '';
        this.config.analyticsTool.adobe.cid.forEach((column) => {
            const columnNormalized = StringUtils_1.StringUtils.normalize(column);
            const stringEmptyHandler = new StringEmptyHandler_1.StringEmptyHandler();
            const validateFieldHandler = new ValidateFieldHandler_1.ValidateFieldHandler(this.config, column);
            const validateFieldDependencyHandler = new ValidateFieldDependencyHandler_1.ValidateFieldDependencyHandler(this.config, this.csvLine, column);
            stringEmptyHandler.setNext(validateFieldHandler).setNext(validateFieldDependencyHandler);
            try {
                stringEmptyHandler.handle(this.csvLine[columnNormalized]);
            }
            catch (e) {
                if (e.name === 'StringEmptyError') {
                    this._hasUndefinedParameterError = true;
                    this._undefinedParameterErroMessage += ` ${column} -`;
                }
                else if (e.name === 'ValidateFieldError' || e.name === 'ValidateFieldDependencyError') {
                    this._hasValidationError = true;
                    this._validationErrorMessage += ` ${column} -`;
                }
            }
            cid += `${this.csvLine[columnNormalized]}${this.config.separator}`;
        });
        cid = StringUtils_1.StringUtils.replaceWhiteSpace(StringUtils_1.StringUtils.normalize(cid), this.config.spaceSeparator).slice(0, -1);
        return cid;
    }
    _buildUrl() {
        const ancora = this.csvLine.url.match(/#.*/);
        const newUrl = this.csvLine.url.replace(`${ancora}`, '');
        const regex = /\?/;
        if (regex.test(newUrl))
            return `${newUrl}&cid=${this._cid}${ancora == null ? '' : ancora}`;
        return `${newUrl}?cid=${this._cid}${ancora == null ? '' : ancora}`;
    }
}
exports.Adobe = Adobe;
