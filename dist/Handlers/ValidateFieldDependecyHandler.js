'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateFieldDependecyHandler = void 0;
const AbstractHandler_1 = require('./AbstractHandler');
const ValidateFieldDependecyError_1 = require('../Errors/ValidateFieldDependecyError');
class ValidateFieldDependecyHandler extends AbstractHandler_1.AbstractHandler {
	constructor(config, csvLine, column) {
		super();
		this._config = config;
		this._csvLine = csvLine;
		this._column = column;
	}
	handle(request) {
		if (!this._config.validateDependencyRulesFor(this._csvLine, this._column, request)) {
			throw new ValidateFieldDependecyError_1.ValidateFieldDependecyError(
				`Coluna ${this._column} não permite o valor ${request}!`
			);
		}
		return super.handle(request);
	}
}
exports.ValidateFieldDependecyHandler = ValidateFieldDependecyHandler;
