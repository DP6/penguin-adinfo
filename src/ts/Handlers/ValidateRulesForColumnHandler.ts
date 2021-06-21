import { AbstractHandler } from './AbstractHandler';
import { ValidateRulesForColumnError } from '../Errors/ValidateRulesForColumnError';
import { Config } from '../models/Config';

export class ValidateRulesForColumnHandler extends AbstractHandler {
	private _config: Config;
	private _column: string;

	constructor(config: Config, column: string) {
		super();
		this._config = config;
		this._column = column;
	}

	public handle(request: string): boolean {
		if (!this._config.validationRules[this._column]) {
			throw new ValidateRulesForColumnError(`Coluna ${this._column} não possui regras de validação!`);
		}
		return super.handle(request);
	}
}
