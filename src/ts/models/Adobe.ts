import { StringUtils } from '../utils/StringUtils';
import { AnalyticsTool } from './AnalyticsTool';

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

export class Adobe extends AnalyticsTool {
	private _cid = '';
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _validationErrorMessage = 'Parâmetros incorretos:';
	private _undefinedParameterErroMessage = 'Parâmetros não encontrados:';

	/**
	 * Recebe os parametros e configurações do csv preenchido e preenche o cid e url
	 * @param csvLine Json contendo as colunas preenchidas no csv e seus valores
	 * @param config Json contendo o cid e seus campos de preenchimento
	 * @param separators Json contendo o separator e o spaceSeparator
	 * @param validationRules Json contendo o nome dos campos e um array com as regras aceitas de preenchimento
	 */
	constructor(
		csvLine: { [key: string]: string },
		config: { [key: string]: string[] },
		separators: { [key: string]: string },
		validationRules: { [key: string]: string[] }
	) {
		super(csvLine, config, separators, validationRules);
		this._buildCid();
		this._buildUrl();
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
	get buildedFields(): { [key: string]: string } {
		return {
			cid: this._hasErrorAtCid() ? this._errorMessage() : this._cid,
			'url adobe': this._hasErrorAtCid()
				? 'Corrija os parâmetros para gerar a URL'
				: this.url,
		};
	}

	/**
	 * Constroi o Cid da linha e preenche o atributo hasErrorAtCid
	 */
	private _buildCid(): void {
		this.config.cid.forEach((column) => {
			const columnNormalized = StringUtils.normalize(column);
			if (this._isEmpty(this.csvLine[columnNormalized])) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErroMessage += ` ${column},`;
				return;
			}
			if (
				this.validationRules[columnNormalized] &&
				!StringUtils.validateString(
					this.csvLine[columnNormalized],
					this.validationRules[columnNormalized]
				)
			) {
				this._hasValidationError = true;
				this._validationErrorMessage += ` ${column},`;
			}
			this._cid += `${this.csvLine[columnNormalized]}${this.separator}`;
		});
		this._cid = StringUtils.replaceWhiteSpace(
			StringUtils.normalize(this._cid),
			this.spaceSeparator
		).slice(0, -1);
	}

	/**
	 * Construção da url para adobe
	 */
	_buildUrl(): void {
		this.url = `${this.csvLine.url}?cid=${this._cid}`;
	}
}
