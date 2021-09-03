export class ValidateColumnExistsError {
	/**
	 * Erro referente à não existência da coluna no config
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
				return 'ValidateColumnExistsError';
			},
		});
		Error.captureStackTrace(error, ValidateColumnExistsError);
		return error;
	}
}
