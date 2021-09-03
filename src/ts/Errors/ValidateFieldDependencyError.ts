export class ValidateFieldDependencyError {
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
				return 'ValidateFieldDependencyError';
			},
		});
		Error.captureStackTrace(error, ValidateFieldDependencyError);
		return error;
	}
}
