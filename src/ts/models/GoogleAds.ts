import { StringUtils } from '../utils/StringUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { Parametrizer } from './Parametrizer';

/**
    params: {
        'Url': 'www.teste.com.br',
        'Tipo de Compra': 'cpc',
        'Dispositivo': 'desktop e mobile'
    }
    config: {
        "campanha": "utm_source",
        "ad": "utm_content"
    }
    separators: {
        separator: ':',
        spaceSeparator: '_'
    }
    rules: {
        'Tipo de Compra': ['cpa','cpc'],
        'Período': ['/.*']
    },
    configTool: {
        utm_medium: [ 'Tipo de Compra' ],
        utm_campaign: [ 'Período','Bandeira ]
    }
    _undefinedParameterErrorFields: { 
        ad: ['utm_campaign']
    }
*/

export class GoogleAds extends Parametrizer {
	private _configTool: { [key: string]: string[] };
	private _config: { [key: string]: string };
	private _adsParams: { [key: string]: string } = {};
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
	private _errorAdsParams: { [key: string]: string[] } = {};
	private _undefinedParameterErrorMessage =
		'Parâmetro(s) não encontrado(s) na configuração: ';
	private _undefinedParameterErrorFields: { [key: string]: string[] } = {};

	/**
	 * Geração dos campos para GoogleAds
	 * @param params Json contendo as colunas preenchidas no csv e seus valores
	 * @param config Json contendo os utms e seus campos de preenchimento
	 * @param separators Json contendo o separator e o spaceSeparator
	 * @param validationRules Json contendo o nome dos campos e um array com as regras aceitas de preenchimento
	 * @param configTool Json configurações do GA ou Adobe
	 *
	 * Recebe os parametros e configurações do csv preenchido e preenche os atributos url
	 */
	constructor(
		csvLine: { [key: string]: string },
		config: { [key: string]: string },
		separators: { [key: string]: string },
		validationRules: { [key: string]: string[] },
		configTool: { [key: string]: string[] }
	) {
		super(csvLine, separators, validationRules);
		this._config = config;
		this._configTool = configTool;
		this._buildAdsParams();
	}

	public buildUrl() {
		return {
			'url google ads': 'auto tagging',
		};
	}

	public buildedLine(): { [key: string]: string } {
		return JsonUtils.addParametersAt(this._adsParams, this.buildUrl());
	}

	/**
	 * Constrói o adsParams
	 */
	private _buildAdsParams(): void {
		Object.keys(this._config).forEach((googleAdsParam) => {
			this._adsParams[googleAdsParam] = '';
			this._errorAdsParams[googleAdsParam] = [];
			this._undefinedParameterErrorFields[googleAdsParam] = [];
			const utm = this._config[googleAdsParam];
			if (!this._configTool[utm]) {
				this._hasUndefinedParameterError = true;
				this._undefinedParameterErrorFields[googleAdsParam].push(utm);
			} else {
				this._configTool[utm].forEach((column) => {
					const normalizedColumn = StringUtils.normalize(column);
					if (
						StringUtils.validateString(
							this.csvLine[normalizedColumn],
							this.validationRules[normalizedColumn]
						)
					) {
						this._adsParams[
							googleAdsParam
						] += `${StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.spaceSeparator
						).toLowerCase()}${this.separator}`;
					} else {
						this._hasValidationError = true;
						this._errorAdsParams[googleAdsParam].push(column);
					}
				});
			}
			if (this._hasValidationError) {
				this._adsParams[googleAdsParam] =
					this._validationErrorMessage +
					this._errorAdsParams[googleAdsParam].join(', ');
			} else if (this._hasUndefinedParameterError) {
				this._adsParams[googleAdsParam] =
					this._undefinedParameterErrorMessage +
					this._undefinedParameterErrorFields[googleAdsParam].join(
						', '
					);
			} else {
				this._adsParams[googleAdsParam] = this._adsParams[
					googleAdsParam
				].slice(0, -1);
			}
		});
	}
}
