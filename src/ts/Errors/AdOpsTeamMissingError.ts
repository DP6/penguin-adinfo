export class AdOpsTeamMissingError {
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
				return 'AdOpsTeamMissingError';
			},
		});
		Error.captureStackTrace(error, AdOpsTeamMissingError);
		return error;
	}
}
