import { JsonUtils } from '../utils/JsonUtils';
import { DependencyConfig } from './DependencyConfig';
import { StringUtils } from '../utils/StringUtils';

export class Config {
	private _separator: string;
	private _spaceSeparator: string;
	private _csvSeparator: string;
	private _insertTime: string;
	private _version: number;
	private _analyticsTool: { [key: string]: { [key: string]: string[] } };
	private _analyticsToolName: string;
	private _medias: { [key: string]: any };
	private _validationRules: { [key: string]: string[] };
	private _dependenciesConfig: DependencyConfig[];

	constructor(jsonConfig: { [key: string]: any }) {
		const jsonConfigTemp = { ...jsonConfig };
		this._separator = jsonConfigTemp.separator;
		delete jsonConfigTemp.separator;
		if (jsonConfigTemp.csvSeparator) {
			this._csvSeparator = jsonConfigTemp.csvSeparator;
			delete jsonConfigTemp.csvSeparator;
		}
		this._dependenciesConfig = this._buildDependenciesConfig(jsonConfigTemp.dependenciesConfig);
		delete jsonConfigTemp.dependenciesConfig;
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
			!this._analyticsTool ||
			!this._validationRules
		);
	}

	private _buildDependenciesConfig(
		dependenciesConfig: {
			columnReference: string;
			valuesReference: string[];
			hasMatch: boolean;
			columnDestiny: string;
			matches: string[];
		}[]
	): DependencyConfig[] {
		if (!dependenciesConfig) {
			return [];
		}
		return dependenciesConfig.map((dependencyConfig) => new DependencyConfig(dependencyConfig));
	}

	/**
	 * Transforma o objeto Config numa string
	 */
	public toString(): string {
		return JSON.stringify(this.toJson());
	}

	/**
	 * Converte o objeto Config no JSON inserido no banco de dados
	 */
	public toJson(): { [key: string]: any } {
		let jsonConfig: { [key: string]: any } = {};
		Object.keys(this).forEach((key: string, index: number) => {
			if (key === '_analyticsTool' || key === '_medias') {
				jsonConfig = JsonUtils.addParametersAt(jsonConfig, Object.values(this)[index]);
			} else if (key === '_validationRules') {
				jsonConfig = JsonUtils.addParametersAt(jsonConfig, {
					columns: this._validationRules,
				});
			} else if (key === '_dependenciesConfig') {
				if (this._dependenciesConfig.length > 0) {
					jsonConfig['dependenciesConfig'] = this._dependenciesConfig.map((dependencyConfig: DependencyConfig) => {
						return dependencyConfig.toJson();
					});
				}
			} else if (key !== '_analyticsToolName' && Object.values(this)[index]) {
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
	 * Verifica se existe alguma regra de validação cadastrada para a coluna especificada do csv
	 * @param csvColumn coluna do CSV a ser conferida
	 */
	private _existsValidationRuleFor(csvColumn: string): boolean {
		return this.validationRules[csvColumn].length > 0;
	}

	/**
	 * Valida se a coluna do CSV foi preenchida corretamente
	 * @param csvColumn Coluna do CSV a ser validada
	 * @param value Valor da coluna
	 */
	public validateRulesFor(csvColumn: string, value: string): boolean {
		if (!this._existsValidationRuleFor(csvColumn)) {
			return true;
		}
		return StringUtils.validateString(value, this._validationRules[csvColumn]);
	}

	/**
	 * Pega a regra de dependência para a coluna do CSV
	 * @param csvColumn Coluan do csv de referência
	 */
	private _getAllDependencyConfigFor(csvColumn: string): DependencyConfig[] {
		const dependenciesColumnConfig: DependencyConfig[] = [];
		this._dependenciesConfig.forEach((dependencyConfig) => {
			if (dependencyConfig.columnDestiny === csvColumn) {
				dependenciesColumnConfig.push(dependencyConfig);
			}
		});
		return dependenciesColumnConfig;
	}

	/**
	 * Valida as regras de dependência para a coluna especificada
	 * @param csvLine Linha do CSV
	 * @param csvColumn Coluna do CSV a ser validada
	 * @param value Valor da coluna
	 */
	public validateDependencyRulesFor(csvLine: { [key: string]: string }, csvColumn: string, value: string): boolean {
		const dependenciesConfigForCsvColumn = this._getAllDependencyConfigFor(csvColumn);

		if (dependenciesConfigForCsvColumn.length === 0) {
			return true;
		}

		const dependenciesToValidate = dependenciesConfigForCsvColumn.filter((dependencyConfig) =>
			StringUtils.validateString(
				csvLine[StringUtils.normalize(dependencyConfig.columnReference)],
				dependencyConfig.valuesReference
			)
		);

		return (
			dependenciesToValidate.filter((dependencyConfig) => {
				if (dependencyConfig.hasMatch) {
					return StringUtils.validateString(value, dependencyConfig.matches);
				} else {
					return !StringUtils.validateString(value, dependencyConfig.matches);
				}
			}).length === dependenciesToValidate.length
		);
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
