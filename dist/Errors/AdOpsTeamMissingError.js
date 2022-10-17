'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AdOpsTeamMissingError = void 0;
class AdOpsTeamMissingError {
	constructor(msg) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'AdOpsTeamMissingError';
			},
		});
		Error.captureStackTrace(error, AdOpsTeamMissingError);
		return error;
	}
}
exports.AdOpsTeamMissingError = AdOpsTeamMissingError;
