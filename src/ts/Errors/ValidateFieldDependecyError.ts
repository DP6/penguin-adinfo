export class ValidateFieldDependecyError {
	/**
	 * Erro referente à incompatibilidade do valor preenchido no campo e as regras de dependência
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
				return 'ValidateFieldDependecyError';
			},
		});
		Error.captureStackTrace(error, ValidateFieldDependecyError);
		return error;
	}
}
