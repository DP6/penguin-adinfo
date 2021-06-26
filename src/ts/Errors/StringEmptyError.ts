export class StringEmptyError {
	/**
	 * Erro referente à String Vazia no preenchimento do CSV
	 * @param msg Mensagem a ser informada no erro
	 */
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
		Error.captureStackTrace(error, StringEmptyError);
		return error;
	}
}
