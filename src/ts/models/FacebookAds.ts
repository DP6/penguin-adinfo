import { StringUtils } from '../utils/StringUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { Parametrizer } from './Parametrizer';
import { Config } from './Config';

/**
    params: {
        'Url': 'www.teste.com.br',
        'Tipo de Compra': 'cpc',
        'Dispositivo': 'desktop e mobile'
    }
    config: {
        "dynamic": true,
        "utm_source": "{{campaign.name}}",
        "utm_term": "{{ad.name}}"
    }
    separators: {
        separator: ':',
        spaceSeparator: '_'
    }
    validationRules: {
        'Tipo de Compra': ['cpa','cpc'],
        'Período': ['/.*']
    },
    configAnalyticsTool: {
        utm_medium: [ 'Tipo de Compra' ],
        utm_campaign: [ 'Período','Bandeira ]
	}
	errorFacebookParams: {
		{{ad.name}}: [],
		{{campaign.id}}: [ 'Produto' ]
	}
	errorUrlParams: {
		{{ad.name}}: [],
		{{campaign.id}}: [ 'Produto' ]
	}
	undefinedParameterErrorFields: {
		{{ad.name}}: [],
		{{campaign.id}}: [ 'utm_source' ]
	}
*/

//TODO parametros compostos e parametros não dinamicos
export class FacebookAds extends Parametrizer {
	private _facebookParams: { [key: string]: string } = {};
	private _configAnalyticsTool: { [key: string]: string[] };
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _validationErrorMessage = 'Parâmetros incorretos: ';
	private _errorFacebookParams: { [key: string]: string[] } = {};
	private _undefinedParameterErrorMessage =
		'Parâmetro(s) não encontrado(s) na configuração: ';
	private _undefinedParameterErrorFields: { [key: string]: string[] } = {};

	/**
	 * Geração dos campos para Facebook
	 * @param params Json contendo as colunas preenchidas no csv e seus valores
	 * @param config
	 *
	 * Recebe os parametros e configurações do csv preenchido e preenche os atributos url
	 */
	constructor(csvLine: { [key: string]: string }, config: Config) {
		super(csvLine, config);
		this._configAnalyticsTool = this._buildConfigAnalyticsTool();
		this._buildUrlParams();
		this.url = this._buildUrl();
		this._clearFacebookParamsNames();
		// this._transformCompoundParameter();
	}

	/**
	 * Constrói a configuração da ferramenta de Analytics
	 */
	private _buildConfigAnalyticsTool(): { [key: string]: string[] } {
		const type = this.config.analyticsToolName;
		const configAnalyticsTool: { [key: string]: string[] } = {};
		Object.keys(this.config.analyticsTool[type]).forEach((param) => {
			configAnalyticsTool[param] = Object.keys(
				this.config.analyticsTool[type][param]
			);
		});
		return configAnalyticsTool;
	}

	/**
	 * Gera os campos referentes ao FacebookAds
	 */
	public buildedLine(): { [key: string]: string } {
		return JsonUtils.addParametersAt(this._facebookParams, {
			'url facebook': this.url,
		});
	}

	//TODO retornar valores
	/**
	 * Constrói os parametros da URL
	 */
	private _buildUrlParams(): void {
		if (this.config.medias.facebookads.dynamicValues) {
			const facebookadsConfig = { ...this.config.medias.facebookads };
			delete facebookadsConfig.dynamicValues;
			Object.keys(facebookadsConfig).forEach((urlParam) => {
				const facebookParam = facebookadsConfig[urlParam];
				if (!this._isCompoundParameter(urlParam)) {
					const urlParamFields: string[] = [];
					this._errorFacebookParams[facebookParam] = [];
					this._undefinedParameterErrorFields[facebookParam] = [];
					if (!this._configAnalyticsTool[urlParam]) {
						this._hasUndefinedParameterError = true;
						this._undefinedParameterErrorFields[facebookParam].push(
							urlParam
						);
						this._facebookParams[facebookParam] = '';
					} else {
						this._configAnalyticsTool[urlParam].forEach(
							(column) => {
								const normalizedColumn = StringUtils.normalize(
									column
								);
								if (
									StringUtils.validateString(
										this.csvLine[normalizedColumn],
										this.config.validationRules[column]
									)
								) {
									urlParamFields.push(
										StringUtils.replaceWhiteSpace(
											this.csvLine[normalizedColumn],
											this.config.spaceSeparator
										).toLocaleLowerCase()
									);
								} else {
									this._hasValidationError = true;
									this._errorFacebookParams[
										facebookParam
									].push(column);
								}
							}
						);
					}
					if (this._errorFacebookParams[facebookParam].length > 0) {
						this._facebookParams[facebookParam] =
							this._validationErrorMessage +
							this._errorFacebookParams[facebookParam].join(', ');
					} else if (
						this._undefinedParameterErrorFields[facebookParam]
							.length > 0
					) {
						this._facebookParams[facebookParam] =
							this._undefinedParameterErrorMessage +
							this._undefinedParameterErrorFields[
								facebookParam
							].join(', ');
					} else {
						this._facebookParams[
							facebookParam
						] = urlParamFields.join(this.config.separator);
					}
				}
			});
		}
	}

	/**
	 *
	 */
	// private _transformCompoundParameter(): void {
	// 	Object.keys(this._facebookParams).forEach((urlParam) => {
	// 		if (this._isCompoundParameter(urlParam)) {
	// 			let value = '';
	// 			urlParam
	// 				.match(/(\{\{[a-zA-z]*\.?[a-zA-z]*\}\})/g)
	// 				.forEach((facebookParam) => {
	// 					value += `${this._facebookParams[facebookParam]}${this._separator}`;
	// 				});
	// 			this._facebookParams[urlParam] = value.match(/Parâmetros incorretos/)
	// 				? 'Parâmetros incorretos'
	// 				: value.slice(0, -1);
	// 		}
	// 	});
	// }

	/**
	 * Constrói a url do facebook
	 */
	protected _buildUrl(): string {
		let url: string;
		if (this._hasValidationError) {
			const errorFields = Object.keys(this._errorFacebookParams).filter(
				(facebookParam) =>
					this._errorFacebookParams[facebookParam].length > 0
			);
			url =
				'Para gerar a URL corrija o(s) parâmetro(s): ' +
				this._clearFacebookParamName(errorFields.join(', '));
		} else if (this._hasUndefinedParameterError) {
			const errorFields = Object.keys(
				this._undefinedParameterErrorFields
			).filter(
				(facebookParam) =>
					this._undefinedParameterErrorFields[facebookParam].length >
					0
			);
			url =
				'Para gerar a URL corrija o(s) parâmetro(s): ' +
				this._clearFacebookParamName(errorFields.join(', '));
		} else {
			url = `${this.csvLine.url}?`;
			const urlParams: string[] = [];
			const facebookadsConfig = { ...this.config.medias.facebookads };
			delete facebookadsConfig.dynamicValues;
			Object.keys(facebookadsConfig).forEach((config) => {
				urlParams.push(`${config}=${facebookadsConfig[config]}`);
			});
			url = url + urlParams.join('&');
		}
		return url;
	}

	/**
	 * Limpa as chaves do JSON do facebook
	 */
	private _clearFacebookParamsNames(): void {
		const newParams: { [key: string]: string } = {};
		Object.keys(this._facebookParams).forEach((param) => {
			const newParam = param.replace(/\{|\}/g, '').replace('.', ' ');
			newParams[newParam] = this._facebookParams[param];
		});
		this._facebookParams = newParams;
	}

	/**
	 * Verifica se o parâmetro é um parâmetro composto
	 * @param parameter Parametro a ser analisado
	 * @returns indica se o parametro é composto
	 */
	private _isCompoundParameter(parameter: string): boolean {
		return /\}\}(.)\{\{/.test(parameter);
	}

	/**
	 * Elimina os caracteres especiais para o parametro do facebook, deixando-o no padrão do cabeçalho
	 * @param parameter parametro do facebook
	 * @returns string do parametro limpa
	 */
	private _clearFacebookParamName(parameter: string): string {
		return parameter.replace(/\{|\}/g, '').replace('.', ' ');
	}
}
