export class ValidateColumnExistsError {
	constructor(msg: string) {
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
		// capture where error occured
		Error.captureStackTrace(error, ValidateColumnExistsError);
		return error;
	}
}
