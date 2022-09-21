"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringEmptyError = void 0;
class StringEmptyError {
    constructor(msg) {
        const error = new Error(msg);
        Object.defineProperty(error, 'message', {
            get() {
                return msg;
            },
        });
        Object.defineProperty(error, 'name', {
            get() {
                return 'StringEmptyError';
            },
        });
        Error.captureStackTrace(error, StringEmptyError);
        return error;
    }
}
exports.StringEmptyError = StringEmptyError;
