import { AbstractHandler } from './AbstractHandler';
import { ValidateRulesForColumnError } from '../Errors/ValidateRulesForColumnError';
import { Config } from '../models/Config';

export class ValidateRulesForColumnHandler extends AbstractHandler {
	private _config: Config;
	private _column: string;

	constructor(config: Config, columnNormalized: string) {
		super();
		this._config = config;
		this._column = columnNormalized;
	}

	/**
	 * Verifica se o campo possui regras de validação
	 * @param request String a ser validada
	 * @returns Em caso de falha, aciona um erro, em caso de acerto, passa para o proximo handler
	 */
	public handle(request = ''): boolean {
		if (!this._config.validationRules[this._column]) {
			throw new ValidateRulesForColumnError(`Coluna ${this._column} não possui regras de validação!`);
		}
		return super.handle(request);
	}
}
