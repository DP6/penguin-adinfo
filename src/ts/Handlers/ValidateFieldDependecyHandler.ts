import { Config } from '../models/Config';
import { AbstractHandler } from './AbstractHandler';
import { ValidateFieldDependecyError } from '../Errors/ValidateFieldDependecyError';

export class ValidateFieldDependecyHandler extends AbstractHandler {
	private _config: Config;
	private _csvLine: { [key: string]: string };
	private _column: string;

	constructor(config: Config, csvLine: { [key: string]: string }, column: string) {
		super();
		this._config = config;
		this._csvLine = csvLine;
		this._column = column;
	}

	public handle(request: string): boolean {
		if (!this._config.validateDependencyRulesFor(this._csvLine, this._column, request)) {
			throw new ValidateFieldDependecyError(`Coluna ${this._column} não permite o valor ${request}!`);
		}
		return super.handle(request);
	}
}
