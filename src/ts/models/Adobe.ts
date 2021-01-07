import { StringUtils } from '../utils/StringUtils';
import { Parametrizer } from './Parametrizer';
import { Config } from './Config';

/**
 csvLine: {
    'Url': 'www.teste.com.br',
    'Tipo de Compra': 'cpc',
    'Dispositivo': 'desktop e mobile'
 }
 config: {
    cid: [ 'Tipo de Compra','Bandeira','Veículo' ]
 }
 separators: {
    separator: ':',
    spaceSeparator: '_'
 }
 rules: {
    'Tipo de Compra': ['cpa','cpc'],
    'Período': ['/.*']
 }
 cid: {
    cid: afiliados:media:cpc:desktop,
    hasError: false
 }
 */

export class Adobe extends Parametrizer {
	private _cid = '';
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _validationErrorMessage = 'Parâmetros incorretos:';
	private _undefinedParameterErroMessage = 'Parâmetros não encontrados:';

	/**
	 * Recebe os parametros e configurações do csv preenchido e preenche o cid e url
	 * @param csvLine Json contendo as colunas preenchidas no csv e seus valores
	 * @param config
	 */
	constructor(csvLine: { [key: string]: string }, config: Config) {
		super(csvLine, config);
		this._buildCid();
		this.buildUrl();
	}

	/**
	 * Verifica se houve algum erro na geração do cid
	 */
	private _hasErrorAtCid(): boolean {
		return this._hasValidationError || this._hasUndefinedParameterError;
	}

	/**
	 * Retorna a mensagem de erro completa da geração do cid
	 */
	private _errorMessage(): string {
		const errorMessages = [];
		if (this._hasUndefinedParameterError) {
			errorMessages.push(
				this._undefinedParameterErroMessage.slice(0, -1)
			);
		}
		if (this._hasValidationError) {
			errorMessages.push(this._validationErrorMessage.slice(0, -1));
		}
		return errorMessages.join(' - ');
	}

	/**
	 * @returns Json parametrizado com o cid e a url do adobe
	 */
	public buildedLine(): { [key: string]: string } {
		return {
			cid: this._hasErrorAtCid() ? this._errorMessage() : this._cid,
			'url adobe': this._hasErrorAtCid()
				? 'Corrija os parâmetros para gerar a URL'
				: this.url,
		};
	}

	//TODO padronizar columns
	/**
	 * Constroi o Cid da linha e preenche o atributo hasErrorAtCid
	 */
	private _buildCid(): void {
		Object.keys(this.config.analyticsTool.adobe.cid).forEach((column) => {
			const columnNormalized = StringUtils.normalize(column);
			if (StringUtils.isEmpty(this.csvLine[columnNormalized])) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErroMessage += ` ${column},`;
				return;
			}
			if (
				this.config.validationRules[column].length > 0 &&
				!StringUtils.validateString(
					this.csvLine[columnNormalized],
					this.config.validationRules[column]
				)
			) {
				this._hasValidationError = true;
				this._validationErrorMessage += ` ${column},`;
			}
			this._cid += `${this.csvLine[columnNormalized]}${this.config.separator}`;
		});
		this._cid = StringUtils.replaceWhiteSpace(
			StringUtils.normalize(this._cid),
			this.config.spaceSeparator
		).slice(0, -1);
	}

	/**
	 * Construção da url para adobe
	 */
	public buildUrl(): void {
		this.url = `${this.csvLine.url}?cid=${this._cid}`;
	}
}
