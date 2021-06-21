export class ValidateFieldError {
	constructor(msg: string) {
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
		// capture where error occured
		Error.captureStackTrace(error, ValidateFieldError);
		return error;
	}
}
