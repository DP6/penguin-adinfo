export class ValidateRulesForColumnError {
	constructor(msg: string) {
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
		// capture where error occured
		Error.captureStackTrace(error, ValidateRulesForColumnError);
		return error;
	}
}
