import { JsonUtils } from '../utils/JsonUtils';
import { Config } from './Config';

export abstract class Parametrizer {
	private _csvLine: { [key: string]: string };
	private _config: Config;

	/**
	 * Recebe os parametros e configurações do csv preenchido e preenche os atributos
	 * @param csvLine Json contendo as colunas preenchidas no csv e seus valores
	 * @param config
	 */
	constructor(csvLine: { [key: string]: string }, config: Config) {
		this._csvLine = JsonUtils.normalizeKeys(csvLine);
		this._config = config;
	}

	get csvLine(): { [key: string]: string } {
		return this._csvLine;
	}

	get config(): Config {
		return this._config;
	}

	/**
	 * Método que constrói e retorna os parametros de parametrização
	 */
	abstract buildedLine(): { values: { [key: string]: string }; hasError: boolean };
}
