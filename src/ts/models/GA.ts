import { StringUtils } from '../utils/StringUtils';
import { Parametrizer } from './Parametrizer';

/**
 csvLine: {
    'Url': 'www.teste.com.br',
    'Tipo de Compra': 'cpc',
    'Dispositivo': 'desktop e mobile'
 }
 config: {
    utm_medium: [ 'Tipo de Compra' ],
    utm_campaign: [ 'Período','Bandeira' ]
 }
 separators: {
    separator: ':',
    spaceSeparator: '_'
 }
 rules: {
    'Tipo de Compra': ['cpa','cpc'],
    'Período': ['/.*']
 }
 utms: {
    utm_campaign: 'afiliados:desktop_e_mobile:cobertura',
    utm_medium: 'cpc'
 }
 */

export class GA extends Parametrizer {
	private _config: { [key: string]: string[] };
	private _utms: { [key: string]: string } = {};
	private _hasValidationError: { [key: string]: boolean } = {};
	private _hasUndefinedParameterError: { [key: string]: boolean } = {};
	private _validationErrorMessage: { [key: string]: string } = {};
	private _undefinedParameterErroMessage: { [key: string]: string } = {};

	/**
	 * Recebe os parametros e configurações do csv preenchido e preenche os atributos utms e url
	 * @param csvLine Json contendo as colunas preenchidas no csv e seus valores
	 * @param config Json contendo os utms e seus campos de preenchimento
	 * @param separators Json contendo o separator e o spaceSeparator
	 * @param validationRules Json contendo o nome dos campos e um array com as regras aceitas de preenchimento
	 */
	constructor(
		csvLine: { [key: string]: string },
		config: { [key: string]: string[] },
		separators: { [key: string]: string },
		validationRules: { [key: string]: string[] }
	) {
		super(csvLine, separators, validationRules);
		Object.keys(config).map((utm) => {
			this._hasValidationError[utm] = false;
			this._hasUndefinedParameterError[utm] = false;
			this._validationErrorMessage[utm] = 'Parâmetros incorretos:';
			this._undefinedParameterErroMessage[utm] =
				'Parâmetros não encontrados:';
		});
		this._config = config;
		this._buildUtms();
		this.buildUrl();
	}

	/**
	 * Retorna se houve erro na geração dos utms
	 */
	private _hasErrorAtUtm(utm: string): boolean {
		return (
			this._hasUndefinedParameterError[utm] ||
			this._hasValidationError[utm]
		);
	}

	/**
	 * Retorna a mensagem de erro completa de cada utm
	 */
	private _errorMessageAtUtm(utm: string): string {
		const errorMessages = [];
		if (this._hasUndefinedParameterError[utm]) {
			errorMessages.push(
				this._undefinedParameterErroMessage[utm].slice(0, -1)
			);
		}
		if (this._hasValidationError[utm]) {
			errorMessages.push(this._validationErrorMessage[utm].slice(0, -1));
		}
		return errorMessages.join(' - ');
	}

	/**
	 * Retorna se há algum erro nos utms
	 */
	private _hasAnyErrorAtUtms(): boolean {
		let hasError = false;
		Object.keys(this._utms).forEach((utm) => {
			if (this._hasErrorAtUtm(utm)) {
				hasError = true;
			}
		});
		return hasError;
	}

	/**
	 * Json parametrizado com os utms e a url do ga
	 */
	public buildedLine(): { [key: string]: any } {
		const utms: { [key: string]: string } = {};
		Object.keys(this._utms).map((utm) => {
			utms[utm] = this._hasErrorAtUtm(utm)
				? this._errorMessageAtUtm(utm)
				: this._utms[utm];
		});
		return {
			utms: utms,
			'url ga': this._hasAnyErrorAtUtms()
				? 'Corrija os parâmetros para gerar a URL'
				: this.url,
		};
	}

	/**
	 * Constrói os utms
	 */
	private _buildUtms(): void {
		Object.keys(this._config).forEach((utm) => {
			let utmString = '';
			this._config[utm].forEach((column) => {
				const columnNormalized = StringUtils.normalize(column);
				if (this._isEmpty(this.csvLine[columnNormalized])) {
					this._hasUndefinedParameterError[utm] = true;
					this._undefinedParameterErroMessage[utm] += ` ${column},`;
					return;
				}
				if (
					this.validationRules[columnNormalized] &&
					!StringUtils.validateString(
						this.csvLine[columnNormalized],
						this.validationRules[columnNormalized]
					)
				) {
					this._hasValidationError[utm] = true;
					this._validationErrorMessage[utm] += ` ${column},`;
				}
				utmString += `${this.csvLine[columnNormalized]}${this.separator}`;
			});
			this._utms[utm] = StringUtils.replaceWhiteSpace(
				StringUtils.normalize(utmString).slice(0, -1),
				this.spaceSeparator
			);
		});
	}

	/**
	 * Constrói a url parametrizada
	 */
	public buildUrl(): void {
		let utmString = '';
		Object.keys(this._utms).forEach((utm) => {
			utmString += `${utm}=${this._utms[utm]}&`;
		});
		this.url = `${this.csvLine.url}?${utmString.slice(0, -1)}`;
	}
}
