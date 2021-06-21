'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AbstractHandler = void 0;
class AbstractHandler {
	setNext(handler) {
		this.nextHandler = handler;
		return handler;
	}
	handle(request) {
		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
		return null;
	}
}
exports.AbstractHandler = AbstractHandler;
