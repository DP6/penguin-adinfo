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

	public handle(request: string): boolean {
		if (!this._config.validateRulesFor(this._column, request)) {
			throw new ValidateFieldError(`Coluna ${this._column} não permite o valor ${request}!`);
		}
		return super.handle(request);
	}
}
