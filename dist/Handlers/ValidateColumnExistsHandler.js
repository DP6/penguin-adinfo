'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidateColumnExistsHandler = void 0;
const AbstractHandler_1 = require('./AbstractHandler');
const ValidateColumnExistsError_1 = require('../Errors/ValidateColumnExistsError');
class ValidateColumnExistsHandler extends AbstractHandler_1.AbstractHandler {
	constructor(config, column) {
		super();
		this._config = config;
		this._column = column;
	}
	handle(request = '') {
		console.log('nome da coluna:', this._column);
		console.log('validacao a ser feita no if:', this._config.existsColumn(this._column));
		if (!this._config.existsColumn(this._column)) {
			throw new ValidateColumnExistsError_1.ValidateColumnExistsError(`A coluna ${this._column} não existe!`);
		}
		return super.handle(request);
	}
}
exports.ValidateColumnExistsHandler = ValidateColumnExistsHandler;
