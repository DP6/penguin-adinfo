"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAds = void 0;
const StringUtils_1 = require("../utils/StringUtils");
const JsonUtils_1 = require("../utils/JsonUtils");
class FacebookAds {
    constructor(params, config, separators, validationRules, configTool) {
        this._facebookParams = {};
        this._hasValidationError = false;
        this._hasUndefinedParameterError = false;
        this._validationErrorMessage = 'Parâmetros incorretos: ';
        this._errorFacebookParams = {};
        this._undefinedParameterErrorMessage = 'Parâmetro(s) não encontrado(s) na configuração: ';
        this._undefinedParameterErrorFields = {};
        this._dynamicValues =
            config['dynamicValues'].toLowerCase() === 'true' ? true : false;
        this._config = Object.assign({}, config);
        delete this._config['dynamicValues'];
        this._params = params;
        this._separator = separators.separator;
        this._spaceSeparator = separators.spaceSeparator;
        this._configTool = configTool;
        this._validationRules = validationRules;
        this._buildUrlParams();
        this._buildUrl();
        this._clearFacebookParamsNames();
    }
    get buildedLine() {
        return JsonUtils_1.JsonUtils.addParametersAt(this._facebookParams, {
            'url facebook': this._url,
        });
    }
    _buildUrlParams() {
        if (this._dynamicValues) {
            Object.keys(this._config).forEach((urlParam) => {
                const facebookParam = this._config[urlParam];
                if (!this._isCompoundParameter(urlParam)) {
                    const urlParamFields = [];
                    this._errorFacebookParams[facebookParam] = [];
                    this._undefinedParameterErrorFields[facebookParam] = [];
                    if (!this._configTool[urlParam]) {
                        this._hasUndefinedParameterError = true;
                        this._undefinedParameterErrorFields[facebookParam].push(urlParam);
                        this._facebookParams[facebookParam] = '';
                    }
                    else {
                        this._configTool[urlParam].forEach((column) => {
                            if (StringUtils_1.StringUtils.validateString(this._params[column], this._validationRules[column])) {
                                urlParamFields.push(StringUtils_1.StringUtils.replaceWhiteSpace(this._params[column], this._spaceSeparator).toLocaleLowerCase());
                            }
                            else {
                                this._hasValidationError = true;
                                this._errorFacebookParams[facebookParam].push(column);
                            }
                        });
                    }
                    if (this._errorFacebookParams[facebookParam].length > 0) {
                        this._facebookParams[facebookParam] =
                            this._validationErrorMessage +
                                this._errorFacebookParams[facebookParam].join(', ');
                    }
                    else if (this._undefinedParameterErrorFields[facebookParam]
                        .length > 0) {
                        this._facebookParams[facebookParam] =
                            this._undefinedParameterErrorMessage +
                                this._undefinedParameterErrorFields[facebookParam].join(', ');
                    }
                    else {
                        this._facebookParams[facebookParam] = urlParamFields.join(this._separator);
                    }
                }
            });
        }
    }
    _buildUrl() {
        if (this._hasValidationError) {
            const errorFields = Object.keys(this._errorFacebookParams).filter((facebookParam) => this._errorFacebookParams[facebookParam].length > 0);
            this._url =
                'Para gerar a URL corrija o(s) parâmetro(s): ' +
                    this._clearFacebookParamName(errorFields.join(', '));
        }
        else if (this._hasUndefinedParameterError) {
            const errorFields = Object.keys(this._undefinedParameterErrorFields).filter((facebookParam) => this._undefinedParameterErrorFields[facebookParam].length >
                0);
            this._url =
                'Para gerar a URL corrija o(s) parâmetro(s): ' +
                    this._clearFacebookParamName(errorFields.join(', '));
        }
        else {
            this._url = `${this._params.Url}?`;
            const urlParams = [];
            Object.keys(this._config).forEach((config) => {
                urlParams.push(`${config}=${this._config[config]}`);
            });
            this._url = this._url + urlParams.join('&');
        }
    }
    _clearFacebookParamsNames() {
        const newParams = {};
        Object.keys(this._facebookParams).forEach((param) => {
            const newParam = param.replace(/\{|\}/g, '').replace('.', ' ');
            newParams[newParam] = this._facebookParams[param];
        });
        this._facebookParams = newParams;
    }
    _isCompoundParameter(parameter) {
        return /\}\}(.)\{\{/.test(parameter);
    }
    _clearFacebookParamName(parameter) {
        return parameter.replace(/\{|\}/g, '').replace('.', ' ');
    }
}
exports.FacebookAds = FacebookAds;
