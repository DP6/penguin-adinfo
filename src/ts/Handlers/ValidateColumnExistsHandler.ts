import { Config } from '../models/Config';
import { AbstractHandler } from './AbstractHandler';
import { ValidateColumnExistsError } from '../Errors/ValidateColumnExistsError';

export class ValidateColumnExistsHandler extends AbstractHandler {
	private _config: Config;
	private _column: string;

	constructor(config: Config, column: string) {
		super();
		this._config = config;
		this._column = column;
	}

	public handle(request: string): boolean {
		if (!this._config.existsColumn(this._column)) {
			throw new ValidateColumnExistsError(`A coluna ${this._column} não existe!`);
		}
		return super.handle(request);
	}
}
