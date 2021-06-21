'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateRulesForColumnError = void 0;
class ValidateRulesForColumnError {
	constructor(msg) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'ValidateRulesForColumnError';
			},
		});
		Error.captureStackTrace(error, ValidateRulesForColumnError);
		return error;
	}
}
exports.ValidateRulesForColumnError = ValidateRulesForColumnError;
