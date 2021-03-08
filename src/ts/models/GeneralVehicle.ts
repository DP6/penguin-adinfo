import { StringUtils } from '../utils/StringUtils';
import { Config } from './Config';
import { Vehicle } from './Vehicle';

/*

{
    parametro1: 
}

*/

export class GeneralVehicle extends Vehicle {
	private _vehicleName: string;
	private _params: { [key: string]: string } = {};
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _errorParams: { [key: string]: string[] } = {};
	private _validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
	private _undefinedParameterErrorMessage =
		'Parâmetro(s) não encontrado(s) na configuração: ';
	private _undefinedParameterErrorFields: { [key: string]: string[] } = {};

	constructor(
		csvLine: { [key: string]: string },
		config: Config,
		vehicleName: string
	) {
		super(csvLine, config);
		this._vehicleName = vehicleName;
		this._buildGeneralParams();
	}

	/**
	 * Gera os campos do GoogleAds
	 */
	public buildedLine(): { [key: string]: string } {
		return this._params;
	}

	private _buildGeneralParams(): void {
		Object.keys(this.config.medias[this._vehicleName]).forEach((param) => {
			this._params[param] = '';
			this._errorParams[param] = [];
			this._undefinedParameterErrorFields[param] = [];
			const csvColumns: string[] = this.config.medias[this._vehicleName][
				param
			];
			csvColumns.forEach((csvColumn) => {
				if (!this.config.existsColumn(csvColumn)) {
					this._undefinedParameterFounded(param, csvColumn);
				} else {
					const normalizedColumn = StringUtils.normalize(csvColumn);
					if (
						!this.config.validateField(
							this.csvLine,
							csvColumn,
							this.csvLine[normalizedColumn]
						)
					) {
						this._validationErrorFounded(param, csvColumn);
					} else {
						this._params[param] += `${StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.config.spaceSeparator
						).toLowerCase()}${this.config.separator}`;
					}
				}
			});
			if (this._hasValidationError) {
				this._params[param] =
					this._validationErrorMessage +
					this._errorParams[param].join(' - ');
			} else if (this._hasUndefinedParameterError) {
				this._params[param] =
					this._undefinedParameterErrorMessage +
					this._undefinedParameterErrorFields[param].join(' - ');
			} else {
				this._params[param] = this._params[param].slice(0, -1);
			}
		});
	}

	/**
	 * Preenche os erros caso algum atributo não seja encontrado no objeto config
	 */
	private _undefinedParameterFounded(param: string, csvColumn: string): void {
		this._hasUndefinedParameterError = true;
		this._undefinedParameterErrorFields[param].push(csvColumn);
	}

	/**
	 * Preenche os erros caso alguma coluna do csv não tenha siddo preenchida corretamente
	 * @param param parametro onde o erro foi encontrado
	 * @param csvColumn coluna do csv
	 */
	private _validationErrorFounded(param: string, csvColumn: string): void {
		this._hasValidationError = true;
		this._errorParams[param].push(csvColumn);
	}
}
