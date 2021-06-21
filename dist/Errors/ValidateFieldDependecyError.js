'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateFieldDependecyError = void 0;
class ValidateFieldDependecyError {
	constructor(msg) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'ValidateFieldDependecyError';
			},
		});
		Error.captureStackTrace(error, ValidateFieldDependecyError);
		return error;
	}
}
exports.ValidateFieldDependecyError = ValidateFieldDependecyError;
