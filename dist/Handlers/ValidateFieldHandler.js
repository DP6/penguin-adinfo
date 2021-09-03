'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateFieldHandler = void 0;
const AbstractHandler_1 = require('./AbstractHandler');
const ValidateFieldError_1 = require('../Errors/ValidateFieldError');
class ValidateFieldHandler extends AbstractHandler_1.AbstractHandler {
	constructor(config, column) {
		super();
		this._config = config;
		this._column = column;
	}
	handle(request) {
		if (!this._config.validateRulesFor(this._column, request)) {
			throw new ValidateFieldError_1.ValidateFieldError(`Coluna ${this._column} não permite o valor ${request}!`);
		}
		return super.handle(request);
	}
}
exports.ValidateFieldHandler = ValidateFieldHandler;
