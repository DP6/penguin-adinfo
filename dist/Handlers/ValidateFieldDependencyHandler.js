'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateFieldDependencyHandler = void 0;
const AbstractHandler_1 = require('./AbstractHandler');
const ValidateFieldDependencyError_1 = require('../Errors/ValidateFieldDependencyError');
class ValidateFieldDependencyHandler extends AbstractHandler_1.AbstractHandler {
	constructor(config, csvLine, column) {
		super();
		this._config = config;
		this._csvLine = csvLine;
		this._column = column;
	}
	handle(request) {
		if (!this._config.validateDependencyRulesFor(this._csvLine, this._column, request)) {
			throw new ValidateFieldDependencyError_1.ValidateFieldDependencyError(
				`Coluna ${this._column} não permite o valor ${request}!`
			);
		}
		return super.handle(request);
	}
}
exports.ValidateFieldDependencyHandler = ValidateFieldDependencyHandler;
