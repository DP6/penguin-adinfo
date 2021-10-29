import { StringUtils } from '../utils/StringUtils';
import { Config } from './Config';
import { Vehicle } from './Vehicle';
import { ValidateRulesForColumnHandler } from '../Handlers/ValidateRulesForColumnHandler';
import { ValidateFieldHandler } from '../Handlers/ValidateFieldHandler';
import { ValidateFieldDependencyHandler } from '../Handlers/ValidateFieldDependencyHandler';

/*
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
    configAnalyticsTool: {
        utm_medium: [ 'Tipo de Compra' ],
        utm_campaign: [ 'Período','Bandeira ]
    }
    _undefinedParameterErrorFields: {
        ad: ['utm_campaign']
    }
*/

export class GoogleAds extends Vehicle {
	private _adsParams: { [key: string]: string } = {};
	private _hasValidationError: { [key: string]: boolean } = {};
	private _hasUndefinedParameterError: { [key: string]: boolean } = {};
	private _validationErrorMessage: { [key: string]: string } = {};
	private _undefinedParameterErrorMessage: { [key: string]: string } = {};
	private _errorAdsParams: { [key: string]: string[] } = {};
	private _undefinedParameterErrorFields: { [key: string]: string[] } = {};

	/**
	 * Geração dos campos para GoogleAds
	 * @param params Json contendo as colunas preenchidas no csv e seus valores
	 * @param config
	 *
	 * Recebe os parametros e configurações do csv preenchido e preenche os atributos url
	 */
	constructor(csvLine: { [key: string]: string }, config: Config) {
		super(csvLine, config);
		Object.keys(this.config.medias.googleads).map((adsParam) => {
			this._hasValidationError[adsParam] = false;
			this._hasUndefinedParameterError[adsParam] = false;
			this._validationErrorMessage[adsParam] = 'Parâmetro(s) incorreto(s): ';
			this._undefinedParameterErrorMessage[adsParam] = 'Parâmetro(s) não encontrado(s): ';
		});
		this._buildAdsParams();
	}

	/**
	 * Constrói a URL do GoogleAds
	 */
	// protected _buildUrl(): string {
	// 	return 'auto tagging';
	// }

	/**
	 * Gera os campos do GoogleAds
	 */
	public buildedLine(): { values: { [key: string]: string }; hasError: boolean } {
		const hasError = Object.keys(this._adsParams).filter(
			(adsParam) => this._hasValidationError[adsParam] || this._hasUndefinedParameterError[adsParam]
		);
		return {
			values: {
				...this._adsParams,
			},
			hasError: hasError.length > 0,
		};
	}

	/**
	 * Constrói o adsParams
	 */
	private _buildAdsParams(): void {
		Object.keys(this.config.medias.googleads).forEach((googleAdsParam) => {
			this._adsParams[googleAdsParam] = '';
			this._errorAdsParams[googleAdsParam] = [];
			this._undefinedParameterErrorFields[googleAdsParam] = [];
			const fields: string[] = this.config.medias.googleads[googleAdsParam];
			fields.forEach((column: string) => {
				const columnNormalized = StringUtils.normalize(column);

				const validateRulesForColumnHandler = new ValidateRulesForColumnHandler(this.config, column);
				const validateFieldHandler = new ValidateFieldHandler(this.config, column);
				const validateFieldDependencyHandler = new ValidateFieldDependencyHandler(this.config, this.csvLine, column);

				validateRulesForColumnHandler.setNext(validateFieldHandler).setNext(validateFieldDependencyHandler);

				try {
					validateRulesForColumnHandler.handle(this.csvLine[columnNormalized]);

					this._adsParams[googleAdsParam] += `${StringUtils.replaceWhiteSpace(
						this.csvLine[columnNormalized],
						this.config.spaceSeparator
					).toLowerCase()}${this.config.separator}`;
				} catch (e) {
					if (e.name === 'ValidateRulesForColumnError') {
						this._hasUndefinedParameterError[googleAdsParam] = true;
						this._undefinedParameterErrorFields[googleAdsParam].push(column);
					} else if (e.name === 'ValidateFieldError' || e.name === 'ValidateFieldDependencyError') {
						this._hasValidationError[googleAdsParam] = true;
						this._errorAdsParams[googleAdsParam].push(column);
					}
				}
			});
			if (this._hasValidationError[googleAdsParam]) {
				this._adsParams[googleAdsParam] =
					this._validationErrorMessage[googleAdsParam] + this._errorAdsParams[googleAdsParam].join(' - ');
			} else if (this._hasUndefinedParameterError[googleAdsParam]) {
				this._adsParams[googleAdsParam] =
					this._undefinedParameterErrorMessage[googleAdsParam] +
					this._undefinedParameterErrorFields[googleAdsParam].join(' - ');
			} else {
				this._adsParams[googleAdsParam] = this._adsParams[googleAdsParam].slice(0, -1);
			}
		});
	}
}
