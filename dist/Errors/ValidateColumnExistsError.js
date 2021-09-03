'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateColumnExistsError = void 0;
class ValidateColumnExistsError {
	constructor(msg) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'ValidateColumnExistsError';
			},
		});
		Error.captureStackTrace(error, ValidateColumnExistsError);
		return error;
	}
}
exports.ValidateColumnExistsError = ValidateColumnExistsError;
