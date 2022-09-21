'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateFieldError = void 0;
class ValidateFieldError {
	constructor(msg) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'ValidateFieldError';
			},
		});
		Error.captureStackTrace(error, ValidateFieldError);
		return error;
	}
}
exports.ValidateFieldError = ValidateFieldError;
