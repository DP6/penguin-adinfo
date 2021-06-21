export class StringEmptyError {
	constructor(msg: string) {
		const error = new Error(msg);
		Object.defineProperty(error, 'message', {
			get() {
				return msg;
			},
		});
		Object.defineProperty(error, 'name', {
			get() {
				return 'StringEmptyError';
			},
		});
		// capture where error occured
		Error.captureStackTrace(error, StringEmptyError);
		return error;
	}
}
