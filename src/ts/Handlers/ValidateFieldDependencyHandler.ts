import { Config } from '../models/Config';
import { AbstractHandler } from './AbstractHandler';
import { ValidateFieldDependencyError } from '../Errors/ValidateFieldDependencyError';

export class ValidateFieldDependencyHandler extends AbstractHandler {
	private _config: Config;
	private _csvLine: { [key: string]: string };
	private _column: string;

	constructor(config: Config, csvLine: { [key: string]: string }, column: string) {
		super();
		this._config = config;
		this._csvLine = csvLine;
		this._column = column;
	}

	/**
	 * Valida se o campo está correto em relação à configuração de dependências
	 * @param request String a ser validada
	 * @returns Em caso de falha, aciona um erro, em caso de acerto, passa para o proximo handler
	 */
	public handle(request: string): boolean {
		if (!this._config.validateDependencyRulesFor(this._csvLine, this._column, request)) {
			throw new ValidateFieldDependencyError(`Coluna ${this._column} não permite o valor ${request}!`);
		}
		return super.handle(request);
	}
}
