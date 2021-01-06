import { JsonUtils } from '../utils/JsonUtils';
import { Config } from './Config';

export abstract class Parametrizer {
	private _csvLine: { [key: string]: string };
	private _url: string;
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

	get url(): string {
		return this._url;
	}

	set url(url: string) {
		this._url = url;
	}

	/**
	 * Método que constrói e retorna os parametros de parametrização
	 */
	abstract buildedLine(): { [key: string]: string };

	/**
	 * Método para construção de URLs
	 */
	abstract buildUrl(): void;

	//TODO passar para o Stringutils
	/**
	 * Verifica se a string está vazia
	 * @param parameter string para checar se está vazia
	 */
	protected _isEmpty(parameter: string): boolean {
		return !parameter;
	}
}
