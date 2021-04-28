'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GeneralVehicle = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const Vehicle_1 = require('./Vehicle');
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
			csvColumns.forEach((csvColumn) => {
				if (!this.config.existsColumn(csvColumn)) {
					this._undefinedParameterFounded(param, csvColumn);
				} else {
					const normalizedColumn = StringUtils_1.StringUtils.normalize(csvColumn);
					if (!this.config.validateField(this.csvLine, csvColumn, this.csvLine[normalizedColumn])) {
						this._validationErrorFounded(param, csvColumn);
					} else {
						this._params[param] += `${StringUtils_1.StringUtils.replaceWhiteSpace(
							this.csvLine[normalizedColumn],
							this.config.spaceSeparator
						).toLowerCase()}${this.config.separator}`;
					}
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
