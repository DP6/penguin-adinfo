import { StringUtils } from '../utils/StringUtils';
import { JsonUtils } from '../utils/JsonUtils';

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
    configTool: {
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
export class FacebookAds {
	private _dynamicValues: boolean;
	private _params: { [key: string]: string };
	private _facebookParams: { [key: string]: string } = {};
	private _config: { [key: string]: string };
	private _configTool: { [key: string]: string[] };
	private _validationRules: { [key: string]: string[] };
	private _spaceSeparator: string;
	private _separator: string;
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _validationErrorMessage = 'Parâmetros incorretos: ';
	private _errorFacebookParams: { [key: string]: string[] } = {};
	private _undefinedParameterErrorMessage =
		'Parâmetro(s) não encontrado(s) na configuração: ';
	private _undefinedParameterErrorFields: { [key: string]: string[] } = {};
	private _url: string;

	/**
	 * Geração dos campos para Facebook
	 * @param params Json contendo as colunas preenchidas no csv e seus valores
	 * @param config Json contendo os utms e seus campos de preenchimento
	 * @param separators Json contendo o separator e o spaceSeparator
	 * @param validationRules Json contendo o nome dos campos e um array com as regras aceitas de preenchimento
	 * @param configTool Json configurações do GA ou Adobe
	 *
	 * Recebe os parametros e configurações do csv preenchido e preenche os atributos url
	 */
	constructor(
		params: { [key: string]: string },
		config: { [key: string]: string },
		separators: { [key: string]: string },
		validationRules: { [key: string]: string[] },
		configTool: { [key: string]: string[] }
	) {
		this._dynamicValues =
			config['dynamicValues'].toLowerCase() === 'true' ? true : false;
		this._config = Object.assign({}, config);
		delete this._config['dynamicValues'];
		this._params = params;
		this._separator = separators.separator;
		this._spaceSeparator = separators.spaceSeparator;
		this._configTool = configTool;
		this._validationRules = validationRules;
		this._buildUrlParams();
		this._buildUrl();
		this._clearFacebookParamsNames();
		// this._transformCompoundParameter();
	}

	get buildedLine(): { [key: string]: string } {
		return JsonUtils.addParametersAt(this._facebookParams, {
			'url facebook': this._url,
		});
	}

	private _buildUrlParams(): void {
		if (this._dynamicValues) {
			Object.keys(this._config).forEach((urlParam) => {
				const facebookParam = this._config[urlParam];
				if (!this._isCompoundParameter(urlParam)) {
					const urlParamFields: string[] = [];
					this._errorFacebookParams[facebookParam] = [];
					this._undefinedParameterErrorFields[facebookParam] = [];
					if (!this._configTool[urlParam]) {
						this._hasUndefinedParameterError = true;
						this._undefinedParameterErrorFields[facebookParam].push(
							urlParam
						);
						this._facebookParams[facebookParam] = '';
					} else {
						this._configTool[urlParam].forEach((column) => {
							if (
								StringUtils.validateString(
									this._params[column],
									this._validationRules[column]
								)
							) {
								urlParamFields.push(
									StringUtils.replaceWhiteSpace(
										this._params[column],
										this._spaceSeparator
									).toLocaleLowerCase()
								);
							} else {
								this._hasValidationError = true;
								this._errorFacebookParams[facebookParam].push(
									column
								);
							}
						});
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
						] = urlParamFields.join(this._separator);
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
	private _buildUrl(): void {
		if (this._hasValidationError) {
			const errorFields = Object.keys(this._errorFacebookParams).filter(
				(facebookParam) =>
					this._errorFacebookParams[facebookParam].length > 0
			);
			this._url =
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
			this._url =
				'Para gerar a URL corrija o(s) parâmetro(s): ' +
				this._clearFacebookParamName(errorFields.join(', '));
		} else {
			this._url = `${this._params.Url}?`;
			const urlParams: string[] = [];
			Object.keys(this._config).forEach((config) => {
				urlParams.push(`${config}=${this._config[config]}`);
			});
			this._url = this._url + urlParams.join('&');
		}
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
