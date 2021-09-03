'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateFieldDependencyError = void 0;
class ValidateFieldDependencyError {
	constructor(msg) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'ValidateFieldDependencyError';
			},
		});
		Error.captureStackTrace(error, ValidateFieldDependencyError);
		return error;
	}
}
exports.ValidateFieldDependencyError = ValidateFieldDependencyError;
