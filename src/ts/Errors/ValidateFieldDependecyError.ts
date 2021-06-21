export class ValidateFieldDependecyError {
	constructor(msg: string) {
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
		// capture where error occured
		Error.captureStackTrace(error, ValidateFieldDependecyError);
		return error;
	}
}
