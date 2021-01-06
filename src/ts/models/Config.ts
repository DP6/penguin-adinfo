import { JsonUtils } from '../utils/JsonUtils';

//TODO documentar os métodos

export class Config {
	private _separator: string;
	private _spaceSeparator: string;
	private _csvSeparator = ',';
	private _insertTime: string;
	private _version: number;
	private _analyticsTool: { [key: string]: any };
	private _analyticsToolName: string;
	private _medias: { [key: string]: any };
	private _validationRules: { [key: string]: any };

	constructor(jsonConfig: { [key: string]: any }) {
		this._separator = jsonConfig.separator;
		delete jsonConfig.separator;
		this._csvSeparator = jsonConfig.csvSeparator;
		delete jsonConfig.csvSeparator;
		this._spaceSeparator = jsonConfig.spaceSeparator;
		delete jsonConfig.spaceSeparator;
		this._insertTime = jsonConfig.insertTime;
		delete jsonConfig.insertTime;
		this._version = jsonConfig.version;
		delete jsonConfig.version;
		if (jsonConfig.ga) {
			this._analyticsTool = { ga: jsonConfig.ga };
			this._analyticsToolName = 'ga';
			delete jsonConfig.ga;
		} else if (jsonConfig.adobe) {
			this._analyticsTool = { adobe: jsonConfig.adobe };
			this._analyticsToolName = 'adobe';
			delete jsonConfig.adobe;
		}
		this._medias = jsonConfig;
		this._validationRules = this._getValidationRules();
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
			} else if (
				key !== '_validationRules' &&
				key !== '_analyticsToolName'
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
			} else if (
				key !== '_validationRules' &&
				key !== '_analyticsToolName'
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
		const vehicle = Object.keys(this._analyticsTool)[0];
		Object.keys(this._analyticsTool[vehicle]).map((campaignParam) => {
			Object.keys(this._analyticsTool[vehicle][campaignParam]).map(
				(param) => {
					if (configValues.indexOf(param) === -1)
						configValues.push(param);
				}
			);
		});
		return configValues.join(this._csvSeparator);
	}

	/**
	 * Retorna as regras de validação
	 */
	private _getValidationRules(): { [key: string]: any } {
		const type = this._analyticsToolName;
		const validationRules: { [key: string]: string[] } = {};
		Object.keys(this._analyticsTool[type]).map((field) => {
			Object.keys(this._analyticsTool[type][field]).map((column) => {
				validationRules[column] = this._analyticsTool[type][field][
					column
				];
			});
		});
		return validationRules;
	}

	get validationRules(): { [key: string]: any } {
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
