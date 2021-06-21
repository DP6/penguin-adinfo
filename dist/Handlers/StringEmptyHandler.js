'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.StringEmptyHandler = void 0;
const StringUtils_1 = require('../utils/StringUtils');
const AbstractHandler_1 = require('./AbstractHandler');
const StringEmptyError_1 = require('../Errors/StringEmptyError');
class StringEmptyHandler extends AbstractHandler_1.AbstractHandler {
	handle(request) {
		if (StringUtils_1.StringUtils.isEmpty(request)) {
			throw new StringEmptyError_1.StringEmptyError(`String vazia detectada!`);
		}
		return super.handle(request);
	}
}
exports.StringEmptyHandler = StringEmptyHandler;
