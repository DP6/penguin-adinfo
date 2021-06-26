export class ValidateRulesForColumnError {
	/**
	 * Erro referente à coluna não conter nenhuma regra de validação
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
				return 'ValidateRulesForColumnError';
			},
		});
		Error.captureStackTrace(error, ValidateRulesForColumnError);
		return error;
	}
}
