"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRulesForColumnHandler = void 0;
const AbstractHandler_1 = require("./AbstractHandler");
const ValidateRulesForColumnError_1 = require("../Errors/ValidateRulesForColumnError");
class ValidateRulesForColumnHandler extends AbstractHandler_1.AbstractHandler {
    constructor(config, columnNormalized) {
        super();
        this._config = config;
        this._column = columnNormalized;
    }
    handle(request = '') {
        if (!this._config.validationRules[this._column]) {
            throw new ValidateRulesForColumnError_1.ValidateRulesForColumnError(`Coluna ${this._column} não possui regras de validação!`);
        }
        return super.handle(request);
    }
}
exports.ValidateRulesForColumnHandler = ValidateRulesForColumnHandler;
