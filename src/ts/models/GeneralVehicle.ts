import { StringUtils } from '../utils/StringUtils';
import { Config } from './Config';
import { Vehicle } from './Vehicle';
import { ValidateColumnExistsHandler } from '../Handlers/ValidateColumnExistsHandler';
import { ValidateFieldHandler } from '../Handlers/ValidateFieldHandler';
import { ValidateFieldDependencyHandler } from '../Handlers/ValidateFieldDependencyHandler';

export class GeneralVehicle extends Vehicle {
	private _vehicleName: string;
	private _params: { [key: string]: string } = {};
	private _hasValidationError = false;
	private _hasUndefinedParameterError = false;
	private _errorParams: { [key: string]: string[] } = {};
	private _validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
	private _undefinedParameterErrorMessage = 'Parâmetro(s) não encontrado(s) na configuração: ';
	private _undefinedParameterErrorFields: { [key: string]: string[] } = {};

	constructor(csvLine: { [key: string]: string }, config: Config, vehicleName: string) {
		super(csvLine, config);
		this._vehicleName = vehicleName;
		this._buildGeneralParams();
		console.log('build general params:', this._buildGeneralParams());
	}

	/**
	 * Gera os campos do GoogleAds
	 */
	public buildedLine(): { values: { [key: string]: string }; hasError: boolean } {
		return {
			values: {
				...this._params,
			},
			hasError: this._hasUndefinedParameterError || this._hasValidationError,
		};
	}

	private _buildGeneralParams(): void {
		Object.keys(this.config.medias[this._vehicleName]).forEach((param) => {
			this._params[param] = '';
			this._errorParams[param] = [];
			this._undefinedParameterErrorFields[param] = [];
			const csvColumns: string[] = this.config.medias[this._vehicleName][param];
			csvColumns.forEach((column) => {
				// console.log('column', column)
				const normalizedColumn = StringUtils.normalize(column);

				const validateColumnExistsError = new ValidateColumnExistsHandler(this.config, column);
				const validateFieldHandler = new ValidateFieldHandler(this.config, column);
				const validateFieldDependencyHandler = new ValidateFieldDependencyHandler(this.config, this.csvLine, column);

				validateColumnExistsError.setNext(validateFieldHandler).setNext(validateFieldDependencyHandler);

				try {
					console.log('csvline da coluna normalizada:', this.csvLine[normalizedColumn]);
					console.log('csvline:', this.csvLine);
					validateColumnExistsError.handle(this.csvLine[normalizedColumn]);
				} catch (e) {
					if (e.name === 'ValidateColumnExistsError') {
						// console.log('to no erro de column exist error')
						// console.log('param:', param, '\ncolumn:', column)
						this._undefinedParameterFounded(param, column);
					} else if (e.name === 'ValidateFieldError' || e.name === 'ValidateFieldDependencyError') {
						// console.log('to no erro de field error')
						this._validationErrorFounded(param, column);
					}
				}
				if (this.csvLine[normalizedColumn]) {
					this._params[param] += `${StringUtils.replaceWhiteSpace(
						this.csvLine[normalizedColumn],
						this.config.spaceSeparator
					).toLowerCase()}${this.config.separator}`;
				}
			});
			if (this._hasValidationError) {
				this._params[param] = this._validationErrorMessage + this._errorParams[param].join(' - ');
			} else if (this._hasUndefinedParameterError) {
				this._params[param] =
					this._undefinedParameterErrorMessage + this._undefinedParameterErrorFields[param].join(' - ');
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
