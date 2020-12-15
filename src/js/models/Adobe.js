"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adobe = void 0;
const StringUtils_1 = require("../utils/StringUtils");
const AnalyticsTool_1 = require("./AnalyticsTool");
class Adobe extends AnalyticsTool_1.AnalyticsTool {
    constructor(csvLine, config, separators, validationRules) {
        super(csvLine, config, separators, validationRules);
        this._cid = '';
        this._hasValidationError = false;
        this._hasUndefinedParameterError = false;
        this._validationErrorMessage = 'Parâmetros incorretos:';
        this._undefinedParameterErroMessage = 'Parâmetros não encontrados:';
        this._buildCid();
        this._buildUrl();
    }
    _hasErrorAtCid() {
        return this._hasValidationError || this._hasUndefinedParameterError;
    }
    _errorMessage() {
        const errorMessages = [];
        if (this._hasUndefinedParameterError) {
            errorMessages.push(this._undefinedParameterErroMessage.slice(0, -1));
        }
        if (this._hasValidationError) {
            errorMessages.push(this._validationErrorMessage.slice(0, -1));
        }
        return errorMessages.join(' - ');
    }
    get buildedFields() {
        return {
            cid: this._hasErrorAtCid() ? this._errorMessage() : this._cid,
            'url adobe': this._hasErrorAtCid()
                ? 'Corrija os parâmetros para gerar a URL'
                : this.url,
        };
    }
    _buildCid() {
        this.config.cid.forEach((column) => {
            const columnNormalized = StringUtils_1.StringUtils.normalize(column);
            if (this._isEmpty(this.csvLine[columnNormalized])) {
                this._hasUndefinedParameterError = true;
                this._undefinedParameterErroMessage += ` ${column},`;
                return;
            }
            if (this.validationRules[columnNormalized] &&
                !StringUtils_1.StringUtils.validateString(this.csvLine[columnNormalized], this.validationRules[columnNormalized])) {
                this._hasValidationError = true;
                this._validationErrorMessage += ` ${column},`;
            }
            this._cid += `${this.csvLine[columnNormalized]}${this.separator}`;
        });
        this._cid = StringUtils_1.StringUtils.replaceWhiteSpace(StringUtils_1.StringUtils.normalize(this._cid), this.spaceSeparator).slice(0, -1);
    }
    _buildUrl() {
        this.url = `${this.csvLine.url}?cid=${this._cid}`;
    }
}
exports.Adobe = Adobe;
