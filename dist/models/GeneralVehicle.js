'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GeneralVehicle = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Vehicle_1 = require('./Vehicle');
const ValidateColumnExistsHandler_1 = require('../Handlers/ValidateColumnExistsHandler');
const ValidateFieldHandler_1 = require('../Handlers/ValidateFieldHandler');
const ValidateFieldDependencyHandler_1 = require('../Handlers/ValidateFieldDependencyHandler');
class GeneralVehicle extends Vehicle_1.Vehicle {
	constructor(csvLine, config, vehicleName) {
		super(csvLine, config);
		this._params = {};
		this._hasValidationError = false;
		this._hasUndefinedParameterError = false;
		this._errorParams = {};
		this._validationErrorMessage = 'Parâmetro(s) incorreto(s): ';
		this._undefinedParameterErrorMessage = 'Parâmetro(s) não encontrado(s) na configuração: ';
		this._undefinedParameterErrorFields = {};
		this._vehicleName = vehicleName;
		this._buildGeneralParams();
	}
	buildedLine() {
		return this._params;
	}
	_buildGeneralParams() {
		Object.keys(this.config.medias[this._vehicleName]).forEach((param) => {
			this._params[param] = '';
			this._errorParams[param] = [];
			this._undefinedParameterErrorFields[param] = [];
			const csvColumns = this.config.medias[this._vehicleName][param];
			csvColumns.forEach((column) => {
				const normalizedColumn = StringUtils_1.StringUtils.normalize(column);
				const validateColumnExistsError = new ValidateColumnExistsHandler_1.ValidateColumnExistsHandler(
					this.config,
					column
				);
				const validateFieldHandler = new ValidateFieldHandler_1.ValidateFieldHandler(this.config, column);
				const validateFieldDependencyHandler = new ValidateFieldDependencyHandler_1.ValidateFieldDependencyHandler(
					this.config,
					this.csvLine,
					column
				);
				validateColumnExistsError.setNext(validateFieldHandler).setNext(validateFieldDependencyHandler);
				try {
					validateColumnExistsError.handle(this.csvLine[normalizedColumn]);
				} catch (e) {
					if (e.name === 'ValidateColumnExistsError') {
						this._undefinedParameterFounded(param, column);
					} else if (e.name === 'ValidateFieldError' || e.name === 'ValidateFieldDependencyError') {
						this._validationErrorFounded(param, column);
					}
				}
				this._params[param] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
					this.csvLine[normalizedColumn],
					this.config.spaceSeparator
				).toLowerCase()}${this.config.separator}`;
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
	_undefinedParameterFounded(param, csvColumn) {
		this._hasUndefinedParameterError = true;
		this._undefinedParameterErrorFields[param].push(csvColumn);
	}
	_validationErrorFounded(param, csvColumn) {
		this._hasValidationError = true;
		this._errorParams[param].push(csvColumn);
	}
}
exports.GeneralVehicle = GeneralVehicle;
