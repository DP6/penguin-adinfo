"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const LoggingSingleton_1 = require("./cloud/LoggingSingleton");
class ApiResponse {
    constructor(statusCode = 200, responseText = '', errorMessage = '') {
        this._statusCode = statusCode;
        this._responseText = responseText;
        this._errorMessage = errorMessage;
    }
    set errorMessage(errorMessage) {
        this._errorMessage = errorMessage;
    }
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(statusCode) {
        this._statusCode = statusCode;
    }
    get responseText() {
        return this._responseText;
    }
    set responseText(responseText) {
        this._responseText = responseText;
    }
    get jsonResponse() {
        const response = {
            responseText: this._responseText,
            errorMessage: this._errorMessage,
        };
        if (this._statusCode !== 200) {
            LoggingSingleton_1.LoggingSingleton.getInstance().logError(JSON.stringify(response));
        }
        return response;
    }
}
exports.ApiResponse = ApiResponse;
