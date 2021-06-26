import { AbstractHandler } from './AbstractHandler';
import { ValidateFieldError } from '../Errors/ValidateFieldError';
import { Config } from '../models/Config';

export class ValidateFieldHandler extends AbstractHandler {
	private _config: Config;
	private _column: string;

	constructor(config: Config, column: string) {
		super();
		this._config = config;
		this._column = column;
	}

	/**
	 * Verifica se o campo está de acordo com a regra de validação do config
	 * @param request String a ser validada
	 * @returns Em caso de falha, aciona um erro, em caso de acerto, passa para o proximo handler
	 */
	public handle(request: string): boolean {
		if (!this._config.validateRulesFor(this._column, request)) {
			throw new ValidateFieldError(`Coluna ${this._column} não permite o valor ${request}!`);
		}
		return super.handle(request);
	}
}
