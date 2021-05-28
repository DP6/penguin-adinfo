'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
	constructor(statusCode = 200, responseText = '', errorMessage = '') {
		this._statusCode = statusCode;
		this._responseText = responseText;
		this._errorMessage = errorMessage;
	}
	set statusCode(statusCode) {
		this._statusCode = statusCode;
	}
	set responseText(responseText) {
		this._responseText = responseText;
	}
	set errorMessage(errorMessage) {
		this._errorMessage = errorMessage;
	}
	get statusCode() {
		return this._statusCode;
	}
	get responseText() {
		return this._responseText;
	}
	get jsonResponse() {
		return {
			responseText: this._responseText,
			errorMessage: this._errorMessage,
		};
	}
}
exports.ApiResponse = ApiResponse;
