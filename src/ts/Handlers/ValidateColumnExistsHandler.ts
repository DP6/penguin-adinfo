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

	/**
	 * Valida se a coluna existe no config
	 * @param request String a ser validada
	 * @returns Em caso de falha, aciona um erro, em caso de acerto, passa para o proximo handler
	 */
	public handle(request = ''): boolean {
		if (!this._config.existsColumn(this._column)) {
			throw new ValidateColumnExistsError(`A coluna ${this._column} não existe!`);
		}
		return super.handle(request);
	}
}
