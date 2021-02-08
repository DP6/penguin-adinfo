import { JsonUtils } from '../utils/JsonUtils';

export class Config {
	private _separator: string;
	private _spaceSeparator: string;
	private _csvSeparator = ',';
	private _insertTime: string;
	private _version: number;
	private _analyticsTool: { [key: string]: { [key: string]: string[] } };
	private _analyticsToolName: string;
	private _medias: { [key: string]: any };
	private _validationRules: { [key: string]: string[] };

	constructor(jsonConfig: { [key: string]: any }) {
		const jsonConfigTemp = { ...jsonConfig };
		this._separator = jsonConfigTemp.separator;
		delete jsonConfigTemp.separator;
		if (jsonConfigTemp.csvSeparator) {
			this._csvSeparator = jsonConfigTemp.csvSeparator;
			delete jsonConfigTemp.csvSeparator;
		}
		this._spaceSeparator = jsonConfigTemp.spaceSeparator;
		delete jsonConfigTemp.spaceSeparator;
		this._insertTime = jsonConfigTemp.insertTime;
		delete jsonConfigTemp.insertTime;
		this._version = jsonConfigTemp.version;
		delete jsonConfigTemp.version;
		if (jsonConfigTemp.ga) {
			this._analyticsTool = { ga: jsonConfigTemp.ga };
			this._analyticsToolName = 'ga';
			delete jsonConfigTemp.ga;
		} else if (jsonConfigTemp.adobe) {
			this._analyticsTool = { adobe: jsonConfigTemp.adobe };
			this._analyticsToolName = 'adobe';
			delete jsonConfigTemp.adobe;
		}
		this._validationRules = jsonConfigTemp.columns;
		delete jsonConfigTemp.columns;
		this._medias = jsonConfigTemp;
	}

	/**
	 * Checa se a configuração é válida
	 */
	public validateConfig(): boolean {
		return !(
			!this._separator ||
			!this._spaceSeparator ||
			!this._insertTime ||
			!this._version ||
			!this._analyticsTool
		);
	}

	/**
	 * Transforma o objeto Config numa string
	 */
	public toString(): string {
		let jsonConfig: { [key: string]: any } = {};
		Object.keys(this).forEach((key: string, index: number) => {
			if (key === '_analyticsTool' || key === '_medias') {
				jsonConfig = JsonUtils.addParametersAt(
					jsonConfig,
					Object.values(this)[index] || {}
				);
			} else if (key === '_validationRules') {
				jsonConfig = JsonUtils.addParametersAt(jsonConfig, {
					columns: this._validationRules,
				});
			} else if (
				key !== '_analyticsToolName' &&
				Object.values(this)[index]
			) {
				jsonConfig[key.replace('_', '')] = Object.values(this)[index];
			}
		});
		return JSON.stringify(jsonConfig);
	}

	/**
	 * Converte o objeto Config no JSON inserido no banco de dados
	 */
	public toJson(): { [key: string]: any } {
		let jsonConfig: { [key: string]: any } = {};
		Object.keys(this).forEach((key: string, index: number) => {
			if (key === '_analyticsTool' || key === '_medias') {
				jsonConfig = JsonUtils.addParametersAt(
					jsonConfig,
					Object.values(this)[index]
				);
			} else if (key === '_validationRules') {
				jsonConfig = JsonUtils.addParametersAt(jsonConfig, {
					columns: this._validationRules,
				});
			} else if (
				key !== '_analyticsToolName' &&
				Object.values(this)[index]
			) {
				jsonConfig[key.replace('_', '')] = Object.values(this)[index];
			}
		});
		return jsonConfig;
	}

	/**
	 * Transforma a configuração em um cabeçalho csv
	 * @param separator Separador de colunas a ser utilizado no CSV
	 * @returns String correspondente ao CSV gerado
	 */
	public toCsvTemplate(): string {
		const configValues: string[] = [];
		configValues.push('Url');
		Object.keys(this._validationRules).forEach((column) => {
			configValues.push(column);
		});
		return configValues.join(this._csvSeparator);
	}

	/**
	 * Verifica se existe alguam regra de validação cadastrada para a coluna especificada do csv
	 * @param csvColumn coluna do CSV a ser conferida
	 */
	public existsValidationRuleFor(csvColumn: string): boolean {
		return this.validationRules[csvColumn].length > 0;
	}

	/**
	 * Verifica se a coluna informada existe no atributo columns da configuração
	 * @param csvColumn
	 */
	public existsColumn(csvColumn: string): boolean {
		return !!this.validationRules[csvColumn];
	}

	get validationRules(): { [key: string]: string[] } {
		return this._validationRules;
	}

	get separator(): string {
		return this._separator;
	}

	get spaceSeparator(): string {
		return this._spaceSeparator;
	}

	get insertTime(): string {
		return this._insertTime;
	}

	set insertTime(insertTime: string) {
		this._insertTime = insertTime;
	}

	get version(): number {
		return this._version;
	}

	set version(version: number) {
		this._version = version;
	}

	get analyticsTool(): { [key: string]: { [key: string]: string[] } } {
		return this._analyticsTool;
	}

	get medias(): { [key: string]: any } {
		return this._medias;
	}

	get analyticsToolName(): string {
		return this._analyticsToolName;
	}

	get csvSeparator(): string {
		return this._csvSeparator;
	}
}
