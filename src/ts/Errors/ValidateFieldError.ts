export class ValidateFieldError {
	/**
	 * Erro referente ao preenchimento incorreto do campo de acordo com as regras de preenchimento do Config
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
				return 'ValidateFieldError';
			},
		});
		Error.captureStackTrace(error, ValidateFieldError);
		return error;
	}
}
